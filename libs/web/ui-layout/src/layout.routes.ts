import { Route } from '@angular/router';
import { unauthGuard } from '@conduit/web/core';

export const ROUTES: Route[] = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadChildren: () => import('@conduit/web/feature-home').then(m => m.FEATURE_HOME_ROUTES),
  },
  {
    path: 'register',
    loadChildren: () => import('@conduit/web/feature-sign-up').then(m => m.FEATURE_SIGN_UP),
  },
  {
    path: 'login',
    loadChildren: () => import('@conduit/web/feature-login').then(m => m.FEATURE_LOGIN_ROUTES),
    canActivate: [unauthGuard],
  },
];
