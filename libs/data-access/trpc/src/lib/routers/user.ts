import { PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as R from 'remeda';
import { z } from 'zod';
import { procedure, router } from '../trpc';

const prisma = new PrismaClient();

const SALT_ROUNDS = 10;

export const userRouter = router({
  userCreate: procedure
    .input(
      z.object({
        email: z.string().email(),
        username: z.string(),
        password: z.string(),
        bio: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);
      const user = await prisma.user.create({
        data: {
          email: input.email,
          username: input.username,
          bio: input.bio,
          password: hashedPassword,
        },
      });
      return R.omit(user, ['password']);
    }),

  userLogin: procedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .query(async req => {
      const user = await prisma.user.findFirst({
        where: {
          email: req.input.email,
        },
      });
      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message:
            'The client request has not been completed because it lacks valid authentication credentials for the requested resource.',
        });
      }

      const isEqual = await bcrypt.compare(req.input.password, user.password);
      if (!isEqual) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid',
        });
      }

      const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, 'SECRET', {
        expiresIn: '600s',
      });
      req.ctx.res.cookie('refreshToken', 'hai', { maxAge: 600000 });
      return {
        user: {
          ...R.omit(user, ['password']),
          token,
        },
      };
    }),
});
