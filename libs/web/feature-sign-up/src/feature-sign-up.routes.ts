import { Route } from '@angular/router';

export const FEATURE_SIGN_UP: Route[] = [
  {
    path: '',
    loadComponent: () => import('./lib/web-feature-sign-up/web-feature-sign-up.component'),
    title: 'Sign Up - Conduit',
  },
];
