import { Route } from '@angular/router';
import { WebFeatureSignUpComponent } from './lib/web-feature-sign-up/web-feature-sign-up.component';

export const FEATURE_SIGN_UP: Route[] = [
  {
    path: '',
    component: WebFeatureSignUpComponent,
    title: 'Sign Up - Conduit',
  },
];
