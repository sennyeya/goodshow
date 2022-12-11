"use client";

import Link from "next/link";
import TimeAgo from "react-timeago";
import type { ClientType } from "../../server/db/frontend-type";
import type { EventWithUser } from "../../server/db/types";

export const EventListItem = ({
  event,
}: {
  event: ClientType<EventWithUser>;
}) => {
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
