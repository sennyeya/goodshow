import { prisma } from "../src/server/db/client";
import { EventList } from "./event";

async function getAllEvents() {
  return (
    await prisma.event.findMany({
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

const SearchBar = () => {
  return (
    <>
      <h2>Search for Events</h2>
      <div className="h-100 mb-7 block w-full rounded-md border border-slate-500">
        <input className="h-100 w-full rounded-md p-1" />
      </div>
    </>
  );
};

export default async function Homepage() {
  const events = await getAllEvents();
  return (
    <>
      <SearchBar />
      <EventList events={events} />
    </>
  );
}
