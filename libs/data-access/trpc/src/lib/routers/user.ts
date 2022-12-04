import { z } from 'zod';
import { procedure, router } from '../trpc';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const userRouter = router({
  userCreate: procedure.input(z.object({ name: z.string().optional(), email: z.string() })).mutation(async req => {
    const user = await prisma.user.create({
      data: {
        email: req.input.email,
        name: req.input.name,
      },
    });
    return user;
  }),
});
