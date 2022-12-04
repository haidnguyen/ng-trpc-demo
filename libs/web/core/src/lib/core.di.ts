import { provideConfig, injectConfig } from './config/config.di';
import { provideClient, injectClient } from './client/trpc-client.di';
import { Provider } from '@angular/core';
import { AppConfig } from './config/config.model';
import { injectToken, provideToken } from './client/token.di';

export const provideCore = (config: AppConfig): Provider => [provideConfig(config), provideToken(), provideClient()];

export { injectClient, injectConfig, injectToken };
