import { router } from "../trpc";
import { authRouter } from "./auth";
import { eventRouter } from "./event";
import { stripeRouter } from "./stripe";
import { ticketRouter } from "./ticket";
import { userRouter } from "./user";

export const appRouter = router({
  user: userRouter,
  event: eventRouter,
  auth: authRouter,
  stripe: stripeRouter,
  ticket: ticketRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
