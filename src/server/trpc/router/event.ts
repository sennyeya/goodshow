import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";

import { prisma } from "../../db/client";

export const eventRouter = router({
  createEvent: protectedProcedure
    .input(z.object({ organizerId: z.string(), title: z.string() }))
    .mutation(async ({ input }) => {
      const event = await prisma.event.create({ data: input });
      return event;
    }),
});
