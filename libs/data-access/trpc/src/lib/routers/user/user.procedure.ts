import { PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as R from 'remeda';
import { z } from 'zod';
import { procedure } from '../../trpc';

const SALT_ROUNDS = 10;
const prisma = new PrismaClient();

export const userCreateProcedure = procedure
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
  });

export const userLoginProcedure = procedure
  .input(
    z.object({
      email: z.string().email(),
      password: z.string(),
    })
  )
  .query(async ({ input }) => {
    const user = await prisma.user.findFirst({
      where: {
        email: input.email,
      },
    });

    if (!user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
      });
    }

    if (!(await bcrypt.compare(input.password, user.password))) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
      });
    }

    const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, 'SECRET', {
      expiresIn: '600s',
    });

    return {
      user: {
        ...R.omit(user, ['password']),
        token,
      },
    };
  });
