import { db } from "../src/server/db/client";
import { EventList } from "../src/components/EventList/EventList";
import { SearchBar } from "../src/components/SearchBar/SearchBar";

async function getAllEvents() {
  return (
    await db.event.findMany({
      include: {
        organizer: true,
      },
    })
  ).map((e) => ({
    ...e,
    updatedAt: e.updatedAt.getTime(),
    createdAt: e.createdAt.getTime(),
  }));
}

export default async function Homepage() {
  const events = await getAllEvents();
  return (
    <>
      <SearchBar />
      <EventList events={events} />
    </>
  );
}
