import { db } from "../../../src/server/db/client";
import type { EventWithUserAndTicketOfferings } from "../db/types";

export async function getEvent(id: string) {
  const event = await db.event.findUnique({
    where: { id },
    include: { organizer: true, ticketOfferings: true },
  });
  if (!event) throw new Error("Not found.");
  return event as EventWithUserAndTicketOfferings;
}
