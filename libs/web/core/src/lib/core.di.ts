import { provideConfig, injectConfig } from './config/config.di';
import { provideClient, injectClient, provideToken, injectTokenController } from './client/trpc-client';
import { Provider } from '@angular/core';
import { AppConfig } from './config/config.model';

export const provideCore = (config: AppConfig): Provider => [provideConfig(config), provideToken(), provideClient()];

export { injectClient, injectConfig, injectTokenController };
