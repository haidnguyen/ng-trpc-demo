import { inferAsyncReturnType, initTRPC } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
export const createContext = (context: trpcExpress.CreateExpressContextOptions) => {
  return context;
};
type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create();
export const router = t.router;
export const middleware = t.middleware;
export const procedure = t.procedure;
