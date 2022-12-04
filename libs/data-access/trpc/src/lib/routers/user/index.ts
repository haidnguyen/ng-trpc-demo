import { router } from '../../trpc';
import { userCreateProcedure, userLoginProcedure } from './user.procedure';

export const userRouter = router({
  userCreate: userCreateProcedure,
  userLogin: userLoginProcedure,
});
