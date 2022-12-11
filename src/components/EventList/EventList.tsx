"use client";

import type { ClientType } from "../../server/db/frontend-type";
import type { EventWithUser } from "../../server/db/types";
import Header from "../DesignSystem/Header/Header";
import { EventListItem } from "./EventListItem";

export const EventList = ({
  events,
}: {
  events: ClientType<EventWithUser>[];
}) => {
  return (
    <div>
      <Header size="lg">Upcoming Events</Header>
      {!!events.length &&
        events.map((e) => <EventListItem event={e} key={e.id} />)}
      {!events.length && <p>No upcoming events.</p>}
    </div>
  );
};
