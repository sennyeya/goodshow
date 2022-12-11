import { z } from "zod";
import { db } from "../../db/client";
import { publicProcedure, router } from "../trpc";

export const ticketRouter = router({
  getRemainingTickets: publicProcedure
    .input(
      z.object({
        ticketOfferingId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const ticketOffering = await db.ticketOffering.findUniqueOrThrow({
        where: {
          id: input.ticketOfferingId,
        },
      });
      return (
        (ticketOffering?.quantity_max || 0) -
        ((await db.ticket.count({
          where: {
            ticketOfferingId: input.ticketOfferingId,
          },
        })) || 0)
      );
    }),
});
