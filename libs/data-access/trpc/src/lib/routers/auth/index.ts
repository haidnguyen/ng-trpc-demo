import { router } from '../../trpc';
import { accessTokenProcedure, loginProcedure, logoutProcedure } from './auth.procedure';

export const authRouter = router({
  login: loginProcedure,
  logout: logoutProcedure,
  accessToken: accessTokenProcedure,
});
