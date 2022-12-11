import { db } from "../db/client";

export async function createTicket({
  userId,
  ticketOfferingId,
}: {
  userId?: string;
  ticketOfferingId: string;
}) {
  return await db.ticket.create({
    data: {
      userId,
      ticketOfferingId,
      status: "pending",
    },
  });
}

export async function updateTicket(id: string, data: object) {
  return await db.ticket.update({
    where: { id },
    data,
  });
}
