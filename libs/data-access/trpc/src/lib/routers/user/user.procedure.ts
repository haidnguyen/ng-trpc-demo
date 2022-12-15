import { TokenPayload } from '@conduit/data-access/parser';
import { PrismaClient, User } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
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

export const userLoginProcedure = procedure
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
      expiresIn: '600s',
    });
    const refreshToken = jwt.sign({ id: user.id }, 'REFRESH_SECRET', { expiresIn: '7 days' });

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken,
      },
      select: selectWithoutCredential,
    });
    ctx.res.cookie('refreshToken', refreshToken, { httpOnly: true });

    return {
      user: {
        ...updatedUser,
        token,
      },
    };
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

export const userLogoutProcedure = protectedProcedure.query(async ({ ctx }) => {
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
    expiresIn: '600s',
  });
  const updatedUser = await prisma.user.update({
    where: {
      id,
    },
    data: {
      refreshToken: newRefreshToken,
    },
    select: selectWithoutCredential,
  });
  ctx.res.cookie('refreshToken', newRefreshToken, { httpOnly: true });

  return {
    ...updatedUser,
    token,
  };
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
