import type { Account, Event, TicketOffering, User } from "@prisma/client";
import { stripe } from ".";
import type { Stripe } from "stripe";
import { db } from "../db/client";

type TicketOfferingWithOrganizer = TicketOffering & {
  event: Event & {
    organizer: User & {
      accounts: Account[];
    };
  };
};

export async function createAccount() {
  return await stripe.accounts.create({
    country: "US",
    type: "express",
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
  });
}

export async function getAccountLink(
  id: string,
  refreshUrl: string,
  returnUrl: string,
  type: Stripe.AccountLinkCreateParams.Type
) {
  return await stripe.accountLinks.create({
    account: id,
    refresh_url: refreshUrl,
    return_url: returnUrl,
    type,
  });
}

export async function getDestinationUser(
  ticketOfferings: TicketOfferingWithOrganizer[]
) {
  return await db.user.findFirstOrThrow({
    where: {
      id: {
        in: ticketOfferings.flatMap((e) =>
          e.event.organizer.accounts.map((f) => f.userId)
        ),
      },
    },
  });
}
