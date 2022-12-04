import { router } from '../../trpc';
import { userCreateProcedure, userLoginProcedure, userSelfProcedure } from './user.procedure';

export const userRouter = router({
  userCreate: userCreateProcedure,
  userLogin: userLoginProcedure,
  me: userSelfProcedure,
});
