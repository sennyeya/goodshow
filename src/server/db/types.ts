import type { Event, TicketOffering, User } from "@prisma/client";

export type EventWithUser = Event & {
  organizer: User;
};

export type EventWithUserAndTicketOfferings = EventWithUser & {
  ticketOfferings: TicketOffering[];
};
