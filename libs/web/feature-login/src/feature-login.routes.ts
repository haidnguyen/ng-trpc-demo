import { Route } from '@angular/router';
import { WebFeatureLoginComponent } from './lib/web-feature-login/web-feature-login.component';

export const FEATURE_LOGIN_ROUTES: Route[] = [
  {
    path: '',
    component: WebFeatureLoginComponent,
  },
];
