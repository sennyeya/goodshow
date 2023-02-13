import { notFound } from "next/navigation";
import { db } from "../../../src/server/db/client";

export async function getEvent(id: string) {
  const event = await db.event.findUnique({
    where: { id },
    include: {
      organizer: true,
      ticketOfferings: true,
      location: true,
      artists: true,
    },
  });
  console.log(event?.ticketOfferings);
  if (!event) notFound();
  return event;
}
