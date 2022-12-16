import { PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import * as bcrypt from 'bcrypt';
import { z } from 'zod';
import { procedure, protectedProcedure } from '../../trpc';
import { selectWithoutCredential } from './user.selector';

const SALT_ROUNDS = 10;
const prisma = new PrismaClient();

export const userCreateProcedure = procedure
  .input(
    z.object({
      email: z.string().email(),
      username: z.string(),
      password: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);
    const user = await prisma.user.create({
      data: {
        email: input.email,
        username: input.username,
        password: hashedPassword,
      },
      select: selectWithoutCredential,
    });
    return user;
  });

export const userSelfProcedure = protectedProcedure.query(async ({ ctx }) => {
  const { userPayload } = ctx;

  if (!userPayload) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
    });
  }

  const user = await prisma.user.findFirst({
    where: {
      id: userPayload.id,
    },
    select: selectWithoutCredential,
  });

  if (!user) {
    throw new TRPCError({
      code: 'NOT_FOUND',
    });
  }

  return user;
});

export const userUpdateProcedure = protectedProcedure
  .input(
    z.object({
      username: z.string(),
      image: z.string().optional(),
      bio: z.string().optional(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { userPayload } = ctx;

    if (!userPayload) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
      });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: userPayload.id,
      },
      data: {
        username: input.username,
        image: input.image,
        bio: input.bio,
      },
      select: selectWithoutCredential,
    });

    return updatedUser;
  });
