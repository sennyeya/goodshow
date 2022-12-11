import type { Ticket, TicketOffering } from "@prisma/client";
import { z } from "zod";
import { db } from "../../db/client";
import { getUser, updateUser } from "../../rpc/user";
import {
  createAccount,
  getAccountLink,
  getDestinationUser,
} from "../../stripe/account";
import { createCheckoutSession } from "../../stripe/payment";
import { getSession } from "../../stripe/session";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const stripeRouter = router({
  checkout: publicProcedure
    .input(
      z.object({
        ticketOfferings: z.array(
          z.object({
            id: z.string(),
            quantity: z.number(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      const { ticketOfferings: ticketOfferingsPurchaseIntent } = input;
      const ticketOfferings = await db.ticketOffering.findMany({
        where: { id: { in: ticketOfferingsPurchaseIntent.map((e) => e.id) } },
        include: {
          event: {
            include: {
              organizer: {
                include: {
                  accounts: true,
                },
              },
            },
          },
        },
      });
      const ticketRequests = ticketOfferings.map((e) => ({
        ticketOffering: e as TicketOffering,
        quantity:
          ticketOfferingsPurchaseIntent.find((f) => f.id === e.id)?.quantity ||
          0,
      }));
      const destinationUser = await getDestinationUser(ticketOfferings);

      const tickets: Ticket[] = [];
      await db.$transaction(async (tx) => {
        for (const ticketOffering of ticketOfferings) {
          const maxTickets = (ticketOffering as TicketOffering).quantity_max;
          const ticketsRemaining =
            maxTickets -
            (await tx.ticket.count({
              where: { ticketOfferingId: ticketOffering.id },
            }));
          const requestedNumberOfTickets = ticketOfferingsPurchaseIntent.find(
            (e) => e.id === ticketOffering.id
          )?.quantity;
          if (!requestedNumberOfTickets) {
            throw new Error("No matching ticket offering found.");
          }
          if (requestedNumberOfTickets > ticketsRemaining) {
            throw new Error("No tickets remaining");
          }
        }
        for (const ticketRequest of ticketRequests) {
          for (let i = 0; i < ticketRequest.quantity; i++) {
            const ticket = await tx.ticket.create({
              data: {
                ticketOffering: {
                  connect: { id: ticketRequest.ticketOffering.id },
                },
                status: "pending",
              },
            });
            if (ticket) tickets.push(ticket);
          }
        }
      });

      const intent = await createCheckoutSession(
        ticketRequests,
        destinationUser,
        "http://localhost:3000"
      );
      await db.$transaction(async (tx) => {
        for (const ticket of tickets) {
          await tx.ticket.update({
            where: { id: ticket.id },
            data: { stripeSessionId: intent.id },
          });
        }
      });
      return intent;
    }),
  register: protectedProcedure.mutation(async ({ ctx }) => {
    const user = await getUser(ctx.session.user.id);
    if (user?.stripeAccountId) {
      throw new Error("Already registered.");
    }
    const account = await createAccount();
    await updateUser(ctx.session.user.id, { stripeAccountId: account.id });
  }),
  getAccountLink: protectedProcedure.query(async ({ ctx }) => {
    const user = await getUser(ctx.session.user.id);
    if (!user?.stripeAccountId)
      throw new Error("Account not onboarded with Stripe.");

    return await getAccountLink(
      user?.stripeAccountId,
      "http://localhost:3000/stripe/refresh",
      "http://localhost:3000/stripe/return",
      "account_onboarding"
    );
  }),
  getSession: publicProcedure
    .input(
      z.object({
        sessionId: z.string(),
      })
    )
    .query(async ({ input }) => {
      return await getSession(input.sessionId);
    }),
});
