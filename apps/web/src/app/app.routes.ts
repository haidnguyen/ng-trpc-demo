import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: () => import('@conduit/web/feature-home').then(m => m.FEATURE_HOME_ROUTES),
  },
];
