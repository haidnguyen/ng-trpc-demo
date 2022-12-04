import { z } from 'zod';
import { procedure, router } from '../trpc';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as R from 'remeda';

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
});
