import type { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "../../../server/stripe";
import type { Stripe } from "stripe";
import { updateTicket } from "../../../server/rpc/ticket";
import { buffer } from "micro";
import { db } from "../../../server/db/client";

export const config = { api: { bodyParser: false } };

const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET as string;

export default async function StripeWebhook(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const sig = req.headers["stripe-signature"] as string;

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        await buffer(req),
        sig,
        endpointSecret
      );
    } catch (err) {
      console.log(err);
      res.status(400).send(`Webhook Error: ${(err as Error).message}`);
      return;
    }

    // Cast event data to Stripe object
    if (event.type === "payment_intent.succeeded") {
      const stripeObject = event.data.object as Stripe.PaymentIntent;
      console.log(`💰 PaymentIntent status: ${stripeObject.status}`);
    } else if (event.type === "charge.succeeded") {
      const charge = event.data.object as Stripe.Charge;
      console.log(`💵 Charge id: ${charge.id}`);
    } else if (event.type === "checkout.session.completed") {
      const checkoutSession = event.data.object as Stripe.Checkout.Session;
      const tickets = await db.ticket.findMany({
        where: {
          stripeSessionId: checkoutSession.id,
        },
      });
      if (!tickets?.length) {
        console.warn("No tickets found for the passed in session.");
        return res.status(200).send("");
      }
      for (const ticket of tickets) {
        await updateTicket(ticket.id, {
          status: "completed",
        });
      }
    } else if (event.type === "checkout.session.expired") {
      const checkoutSession = event.data.object as Stripe.Checkout.Session;
      await db.ticket.deleteMany({
        where: { stripeSessionId: checkoutSession.id },
      });
    } else {
      console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.status(200).send("");
  } else {
    res.status(404).send("");
  }
}
