import { initTRPC } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
export const createContext = (
  context: trpcExpress.CreateExpressContextOptions
) => ({});

const t = initTRPC.create();
export const router = t.router;
export const middleware = t.middleware;
export const procedure = t.procedure;
