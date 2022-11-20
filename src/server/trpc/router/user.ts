import { router, publicProcedure, protectedProcedure } from "../trpc";
import { prisma } from "../../db/client";

export const userRouter = router({
  getAllOrganizers: publicProcedure.query(async () => {
    return await prisma.user.findMany();
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "You are logged in and can see this secret message!";
  }),
});
