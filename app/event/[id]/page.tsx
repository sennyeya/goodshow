import Image from "next/image";
import Checkout from "../../../src/components/Checkout/Checkout";
import { getEvent } from "../../../src/server/rpc/event";
import Photo from "../../../public/concert-photo.webp";

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
          <h1 className="text-2xl font-semibold">Jan 15th, 2023</h1>
          <h2 className="text-md font-light">Doors: 7pm; Show: 8pm</h2>
          <p className="text-md font-light">21+</p>
          {event.ticketOfferings.map((e) => (
            <>
              <hr className="my-4" />
              <h1 className="text-lg">{e.type}</h1>
              <Checkout
                key={e.id}
                perTicketCost={e.price.toNumber()}
                perTicketFee={2.75}
                ticketOffering={e}
              />
            </>
          ))}
        </div>
        <div className="relative basis-9/12 overflow-scroll px-3">
          <h1 className="mb-2 text-5xl font-semibold">
            <a href="" className="underline">
              Stripes
            </a>
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
            <a href="" className="underline">
              Madison Square Garden
            </a>
          </h2>
          <hr className="my-4" />
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis
            blandit turpis cursus in hac habitasse. Amet venenatis urna cursus
            eget nunc scelerisque viverra. Vitae nunc sed velit dignissim
            sodales ut eu. Neque volutpat ac tincidunt vitae semper quis. Id
            diam maecenas ultricies mi. Elementum nisi quis eleifend quam
            adipiscing vitae proin sagittis nisl. Vitae suscipit tellus mauris a
            diam maecenas sed enim. Cras sed felis eget velit aliquet sagittis
            id consectetur. Netus et malesuada fames ac turpis egestas.
            Ultricies lacus sed turpis tincidunt id aliquet risus feugiat. Urna
            cursus eget nunc scelerisque. Mauris pellentesque pulvinar
            pellentesque habitant morbi tristique senectus. Etiam dignissim diam
            quis enim lobortis scelerisque. Tincidunt praesent semper feugiat
            nibh sed pulvinar proin. Risus viverra adipiscing at in tellus.
            Dolor sed viverra ipsum nunc. Nunc congue nisi vitae suscipit tellus
            mauris a diam. Ultrices tincidunt arcu non sodales neque sodales ut.
            Interdum consectetur libero id faucibus nisl tincidunt. Arcu dui
            vivamus arcu felis bibendum ut tristique et egestas. Et netus et
            malesuada fames ac. Bibendum ut tristique et egestas quis ipsum
            suspendisse ultrices gravida. Metus aliquam eleifend mi in nulla
            posuere sollicitudin. Est ultricies integer quis auctor elit sed
            vulputate mi sit. Vitae elementum curabitur vitae nunc sed velit
            dignissim sodales. Aliquet eget sit amet tellus. Sem integer vitae
            justo eget magna fermentum. Cursus metus aliquam eleifend mi.
            Scelerisque felis imperdiet proin fermentum leo vel orci porta. Sit
            amet cursus sit amet dictum sit amet justo donec. Nisl rhoncus
            mattis rhoncus urna neque viverra justo nec ultrices. Morbi
            tincidunt augue interdum velit euismod in pellentesque. Odio euismod
            lacinia at quis. Enim ut tellus elementum sagittis.
          </p>
          <a className="underline">Venue Rules</a>
        </div>
      </div>
    </>
  );
}
