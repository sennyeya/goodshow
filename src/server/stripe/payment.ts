import type { TicketOffering, User } from "@prisma/client";
import { stripe } from ".";
import type { Stripe } from "stripe";

export async function createCheckoutSession(
  tickets: {
    ticketOffering: TicketOffering;
    quantity: number;
  }[],
  destinationUser: User,
  domainURL: string
) {
  if (!destinationUser.stripeAccountId) {
    throw new Error("Event has no related payment account.");
  }
  const items: Stripe.Checkout.SessionCreateParams.LineItem[] = tickets.map(
    (e) => ({
      price_data: {
        currency: "USD",
        unit_amount: e.ticketOffering.price * 100,
        product_data: {
          name: e.ticketOffering.type,
        },
      },
      quantity: e.quantity,
    })
  );
  const numberOfTickets = tickets.reduce(
    (previous, current) => previous + current.quantity,
    0
  );
  return await stripe.checkout.sessions.create({
    line_items: [
      ...items,
      {
        price_data: {
          currency: "USD",
          unit_amount: 275,
          product_data: {
            name: "Fee",
          },
        },
        quantity: numberOfTickets,
      },
    ],
    expires_at: Math.floor(Date.now() / 1000) + 60 * 30 + 10,
    mode: "payment",
    payment_intent_data: {
      application_fee_amount: 275 * numberOfTickets,
      // The account receiving the funds, as passed from the client.
      transfer_data: {
        destination: destinationUser.stripeAccountId,
      },
    },
    // ?session_id={CHECKOUT_SESSION_ID} means the redirect will have the session ID set as a query param
    success_url: `${domainURL}/purchase/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${domainURL}/purchase/canceled`,
  });
}
