import { TokenPayload } from '@conduit/data-access/parser';
import { PrismaClient, User } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { z } from 'zod';
import { procedure, protectedProcedure } from '../../trpc';

const prisma = new PrismaClient();

export const loginProcedure = procedure
  .input(
    z.object({
      email: z.string().email(),
      password: z.string(),
    })
  )
  .query(async ({ input, ctx }) => {
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
    const isEqual = await bcrypt.compare(input.password, user.password);
    if (!isEqual) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
      });
    }
    const payload: TokenPayload = { id: user.id, username: user.username, email: user.email };
    const token = jwt.sign(payload, 'SECRET', {
      expiresIn: '120s',
    });
    const refreshToken = jwt.sign({ id: user.id }, 'REFRESH_SECRET', { expiresIn: '7 days' });

    ctx.res.cookie('refreshToken', refreshToken, { httpOnly: true });
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken,
      },
    });

    return {
      token,
    };
  });

export const logoutProcedure = protectedProcedure.mutation(async ({ ctx }) => {
  const { userPayload } = ctx;
  if (!userPayload) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
    });
  }

  await prisma.user.update({
    where: {
      id: userPayload.id,
    },
    data: {
      refreshToken: null,
    },
  });

  ctx.res.cookie('refreshToken', 'deleted', { httpOnly: true, expires: new Date(0) });
  return { message: 'SUCCESS' };
});

export const accessTokenProcedure = procedure.query(async ({ ctx }) => {
  const refreshToken = z.string().parse(ctx.req.cookies.refreshToken);
  const { id } = jwt.verify(refreshToken, 'REFRESH_SECRET') as jwt.JwtPayload & { id: User['id'] };
  const user = await prisma.user.findFirst({
    where: {
      id,
    },
  });

  if (!user || user.refreshToken !== refreshToken) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
    });
  }

  const newRefreshToken = jwt.sign({ id: user.id }, 'REFRESH_SECRET', { expiresIn: '7 days' });
  const payload: TokenPayload = { id: user.id, username: user.username, email: user.email };
  const token = jwt.sign(payload, 'SECRET', {
    expiresIn: '120s',
  });
  ctx.res.cookie('refreshToken', newRefreshToken, { httpOnly: true });

  await prisma.user.update({
    where: {
      id,
    },
    data: {
      refreshToken: newRefreshToken,
    },
  });

  return {
    token,
  };
});
