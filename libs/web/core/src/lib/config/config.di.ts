import { inject, InjectionToken, Provider } from '@angular/core';
import { AppConfig } from './config.model';

export const CONFIG_DI_TOKEN = new InjectionToken<AppConfig>('Application Configuration');

export const provideConfig = (config: AppConfig): Provider => ({
  provide: CONFIG_DI_TOKEN,
  useValue: config,
});

export const injectConfig = () => inject(CONFIG_DI_TOKEN);
