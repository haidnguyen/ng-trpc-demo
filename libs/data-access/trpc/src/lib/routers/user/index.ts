import { router } from '../../trpc';
import { userCreateProcedure, userSelfProcedure, userUpdateProcedure } from './user.procedure';

export const userRouter = router({
  userCreate: userCreateProcedure,
  me: userSelfProcedure,
  userUpdate: userUpdateProcedure,
});
