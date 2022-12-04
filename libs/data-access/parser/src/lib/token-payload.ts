import { z } from 'zod';

export const tokenPayloadParser = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().email(),
});

export type TokenPayload = z.infer<typeof tokenPayloadParser>;
