import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('@conduit/web/ui-layout').then(m => m.WebUiLayoutComponent),
    loadChildren: () => import('@conduit/web/ui-layout').then(m => m.ROUTES),
  },
];
