import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { db } from "../../db/client";

export const eventRouter = router({
  upsertEvent: protectedProcedure
    .input(
      z.object({
        event: z.object({
          id: z.string().optional(),
          title: z.string(),
        }),
        artists: z.array(
          z.object({
            id: z.string().optional(),
            name: z.string(),
            link: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ input: { event, artists }, ctx }) => {
      // Create Event.
      console.log(db, event, artists, ctx);
    }),
});
