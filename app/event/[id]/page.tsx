import { prisma } from "../../../src/server/db/client";

async function getEvent(id: string) {
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) throw new Error("Not found.");
  return event;
}

export default async function EventDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const event = await getEvent(params.id);
  return <p>{event?.id}</p>;
}
