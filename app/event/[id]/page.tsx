import Image from "next/image";
import Checkout from "../../../src/components/Checkout/Checkout";
import { getEvent } from "../../../src/server/rpc/event";
import Photo from "../../../public/concert-photo.webp";
import { DateTime } from "luxon";

export default async function EventDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const event = await getEvent(params.id);
  return (
    <>
      <div className="flex">
        <div className="basis-3/12 px-3">
          <Image
            width={512}
            height={512}
            className="h-auto w-full"
            src={Photo}
            alt="Concert photo"
          />
          <h1 className="text-2xl font-semibold">
            {DateTime.fromJSDate(event.doorsTime).toLocaleString(
              DateTime.DATE_HUGE
            )}
          </h1>
          <h2 className="text-md font-light">
            Doors:{" "}
            {DateTime.fromJSDate(event.doorsTime)
              .toFormat("h:mma")
              .replace(":00", "")
              .toLowerCase()}
            ; Show:{" "}
            {DateTime.fromJSDate(event.startTime)
              .toFormat("h:mma")
              .replace(":00", "")
              .toLowerCase()}
          </h2>
          <p className="text-md font-light">{event.ageRestriction}</p>
          {event.ticketOfferings.map((e) => (
            <>
              <hr className="my-4" />
              <h1 className="text-lg">{e.type}</h1>
              <Checkout
                key={e.id}
                perTicketCost={e.price}
                perTicketFee={2.75}
                ticketOffering={e}
              />
            </>
          ))}
        </div>
        <div className="relative basis-9/12 overflow-scroll px-3">
          {event.title && (
            <h1 className="mb-2 text-6xl font-thin">{event.title}</h1>
          )}
          <h1 className="mb-2 text-5xl font-semibold">
            {event.artists.map((artist) => (
              <a href={artist.link} key={artist.id} className="underline">
                {artist.name}
              </a>
            ))}
          </h1>
          <h2 className="mb-1 text-3xl font-normal">
            w/{" "}
            <a href="" className="underline">
              The Strokes
            </a>{" "}
            &{" "}
            <a href="" className="underline">
              LCD Soundsystem
            </a>
          </h2>
          <h2 className="text-lg font-light">
            at{" "}
            <a href={event.location.link} className="underline">
              {event.location.name}
            </a>
          </h2>
          <hr className="my-4" />
          <p>{event.description}</p>
          <a className="underline" href={event.rules}>
            Venue Rules
          </a>
        </div>
      </div>
    </>
  );
}
