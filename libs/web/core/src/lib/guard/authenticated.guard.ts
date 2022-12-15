import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../auth/auth.service';

export const authenticatedGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.isAuth().pipe(
    map(isAuth => {
      return isAuth ? isAuth : router.createUrlTree(['/home']);
    })
  );
};
