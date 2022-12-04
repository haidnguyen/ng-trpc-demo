import { z } from 'zod';
import { procedure, router } from '../trpc';

export const userRouter = router({
  getUser: procedure.input(z.string()).query(req => {
    return {
      id: req.input,
      name: 'Hai',
    };
  }),
  getInfo: procedure.input(z.string()).query(req => {
    return {
      name: req.input,
      test: 'aaa',
    };
  }),
});
