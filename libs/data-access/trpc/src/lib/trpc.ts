import { inferAsyncReturnType, initTRPC, TRPCError } from '@trpc/server';
import * as jwt from 'jsonwebtoken';
import * as trpcExpress from '@trpc/server/adapters/express';
import { TokenPayload, tokenPayloadParser } from '@conduit/data-access/parser';

export const createContext = async (context: trpcExpress.CreateExpressContextOptions) => {
  let userPayload: TokenPayload | null = null;
  let isTokenExpired = false;
  if (context.req.headers.authorization) {
    try {
      const payload = jwt.verify(context.req.headers.authorization, 'SECRET');
      userPayload = tokenPayloadParser.parse(payload);
    } catch (err) {
      if (err instanceof Error && err.name === 'TokenExpiredError') {
        userPayload = null;
        isTokenExpired = true;
      }
    }
  }

  return {
    req: context.req,
    res: context.res,
    userPayload: userPayload,
    isTokenExpired,
  };
};
type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create();

const isAuthed = t.middleware(({ next, ctx }) => {
  if (ctx.isTokenExpired) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'TOKEN_EXPIRED',
    });
  }
  if (!ctx.userPayload) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({
    ctx,
  });
});
export const router = t.router;
export const middleware = t.middleware;
export const procedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
