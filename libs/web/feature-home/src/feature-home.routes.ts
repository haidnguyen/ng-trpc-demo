import { Route } from '@angular/router';
import { WebFeatureHomeComponent } from './lib/web-feature-home/web-feature-home.component';

export const FEATURE_HOME_ROUTES: Route[] = [
  {
    path: '',
    component: WebFeatureHomeComponent,
  },
];
