import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export const unauthGuard = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.isUserLoggedIn() ? router.createUrlTree(['/home']) : true;
};
