import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { parseLocation } from "parse-address";
import { DateTime } from "luxon";

const convertToDate = (arg: unknown) => {
  if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
  throw new Error("test");
};

export const eventRouter = router({
  upsertEvent: protectedProcedure
    .input(
      z.object({
        event: z.object({
          id: z.string().optional(),
          title: z.string().min(2),
          date: z.object({
            doors: z.preprocess(convertToDate, z.date()),
            show: z.preprocess(convertToDate, z.date()),
            date: z.preprocess(convertToDate, z.date()),
          }),
          tickets: z.object({
            id: z.string().optional(),
            price: z.number().min(0),
            quantity: z.number().int(),
          }),
          location: z.object({
            id: z.string().optional(),
            name: z.string(),
            address: z.string(),
          }),
          restrictions: z.object({
            age: z.enum(["all", "16+", "18+", "21+"]),
            rules: z.string().url(),
          }),
          opensAt: z.preprocess(convertToDate, z.date()),
        }),
        artists: z
          .array(
            z.object({
              id: z.string().optional(),
              name: z.string().min(1),
              link: z.string().min(1),
            })
          )
          .min(1),
      })
    )
    .mutation(
      async ({
        input: { event, artists },
        ctx: {
          prisma: db,
          session: { user },
        },
      }) => {
        const { city, state, zip } = parseLocation(event.location.address);
        const date = DateTime.fromJSDate(event.date.date).startOf("day");
        const startDate = DateTime.fromJSDate(event.date.show)
          .startOf("minute")
          .set({
            year: date.year,
            month: date.month,
            day: date.day,
          })
          .toJSDate();
        const doorsDate = DateTime.fromJSDate(event.date.doors)
          .startOf("minute")
          .set({
            year: date.year,
            month: date.month,
            day: date.day,
          })
          .toJSDate();
        if (!event.id) {
          // Create Event.
          await db.event.create({
            data: {
              doorsTime: doorsDate,
              startTime: startDate,
              rules: event.restrictions.rules,
              ageRestriction: event.restrictions.age,
              title: event.title,
              description: "test test",
              organizer: {
                connect: {
                  id: user.id,
                },
              },
              artists: {
                create: artists,
              },
              ticketOfferings: {
                create: {
                  quantity_max: event.tickets.quantity,
                  price: event.tickets.price,
                  type: "GA",
                  quantity_remaining: event.tickets.quantity,
                },
              },
              location: {
                create: {
                  link: "http://google.com",
                  name: event.location.name,
                  address: event.location.address,
                  city,
                  state,
                  zip,
                  country: "USA",
                  approvedUsers: {
                    create: {
                      userId: user.id,
                    },
                  },
                },
              },
            },
          });
        } else {
          await db.$transaction([
            db.ticketOffering.update({
              where: {
                id: event.tickets.id,
              },
              data: {
                quantity_max: event.tickets.quantity,
                price: event.tickets.price,
                type: "GA",
                quantity_remaining: event.tickets.quantity,
              },
            }),
            db.location.update({
              where: {
                id: event.location.id,
              },
              data: {
                link: "http://google.com",
                name: event.location.name,
                address: event.location.address,
                city,
                state,
                zip,
                country: "USA",
              },
            }),
            db.event.update({
              where: {
                id: event.id,
              },
              data: {
                doorsTime: doorsDate,
                startTime: startDate,
                rules: event.restrictions.rules,
                ageRestriction: event.restrictions.age,
                title: event.title,
                description: "test test",
                organizer: {
                  connect: {
                    id: user.id,
                  },
                },
                artists: {
                  connectOrCreate: artists.map((artist) => ({
                    where: {
                      id: artist.id,
                    },
                    create: artist,
                  })),
                },
              },
            }),
            db.artist.deleteMany({
              where: {
                AND: [
                  {
                    eventId: event.id,
                  },
                  {
                    id: {
                      notIn: artists
                        .map((e) => e.id)
                        .filter((e): e is string => Boolean(e)),
                    },
                  },
                ],
              },
            }),
          ]);
        }
        return null;
      }
    ),
});
