import { router } from '../trpc';
import { userRouter } from './user';

const appRouter = router({
  user: userRouter,
});

export type AppRouter = typeof appRouter;
