import { router, publicProcedure, protectedProcedure } from "../trpc";
import { db } from "../../db/client";
import { getUser } from "../../rpc/user";

export const userRouter = router({
  getAllOrganizers: publicProcedure.query(async () => {
    return await db.user.findMany();
  }),
  getUser: protectedProcedure.query(async ({ ctx }) => {
    return await getUser(ctx.session.user.id);
  }),
});
