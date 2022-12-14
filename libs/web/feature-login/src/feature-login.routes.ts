import { Route } from '@angular/router';

export const FEATURE_LOGIN_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => import('./lib/web-feature-login/web-feature-login.component'),
    title: 'Sign in - Conduit',
  },
];
