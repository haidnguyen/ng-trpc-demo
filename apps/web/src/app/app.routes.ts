import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: () => import('@conduit/web/feature-home').then(m => m.FEATURE_HOME_ROUTES),
  },
  {
    path: 'register',
    loadChildren: () => import('@conduit/web/feature-sign-up').then(m => m.FEATURE_SIGN_UP),
  },
];
