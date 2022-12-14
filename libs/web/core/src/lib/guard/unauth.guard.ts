import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { map, tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';

export const unauthGuard = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.isAuth().pipe(
    tap(isAuth => {
      if (isAuth) {
        router.navigateByUrl('/home');
      }
    }),
    map(isAuth => !isAuth)
  );
};
