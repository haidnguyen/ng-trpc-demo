import { Route } from '@angular/router';

export const FEATURE_SETTINGS_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => import('./lib/web-feature-settings/web-feature-settings.component'),
    title: 'Settings - Conduit',
  },
];
