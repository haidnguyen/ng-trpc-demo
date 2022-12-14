import { router } from '../../trpc';
import {
  accessTokenProcedure,
  userCreateProcedure,
  userLoginProcedure,
  userLogoutProcedure,
  userSelfProcedure,
} from './user.procedure';

export const userRouter = router({
  userCreate: userCreateProcedure,
  userLogin: userLoginProcedure,
  me: userSelfProcedure,
  accessToken: accessTokenProcedure,
  userLogout: userLogoutProcedure,
});
