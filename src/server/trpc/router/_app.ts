import { router } from "../trpc";
import { authRouter } from "./auth";
import { eventRouter } from "./event";
import { userRouter } from "./user";

export const appRouter = router({
  user: userRouter,
  event: eventRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
