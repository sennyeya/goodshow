"use client";

import { Event, User } from "@prisma/client";
import Link from "next/link";
import TimeAgo from "react-timeago";

type EventWithUser = Omit<Event, "createdAt" | "updatedAt"> & {
  organizer: User;
  createdAt: number;
  updatedAt: number;
};

const EventListItem = ({ event }: { event: EventWithUser }) => {
  return (
    <Link
      href={`/event/${event.id}`}
      className="my-2 flex justify-between rounded-md border border-solid border-black p-2"
    >
      <div className="flex flex-col">
        <TimeAgo date={event.createdAt} />
        <span>
          <b>Title: </b>
          {event.title}
        </span>
      </div>
      <div>
        <span>{event.organizer.email}</span>
      </div>
    </Link>
  );
};

export const EventList = ({ events }: { events: EventWithUser[] }) => {
  return (
    <div>
      <h2>Upcoming Events</h2>
      {events.map((e) => (
        <EventListItem event={e} key={e.id} />
      ))}
    </div>
  );
};
