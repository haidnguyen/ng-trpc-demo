import { inject, InjectionToken, Provider } from '@angular/core';
import type { AppRouter } from '@conduit/data-access/trpc';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import { injectConfig } from '../config/config.di';
import { TokenService } from './token.service';

const TRPC_PROVIDER = new InjectionToken<ReturnType<typeof createTRPCProxyClient<AppRouter>>>('__TRPC_PROVIDER__');

export const injectTokenController = () => inject(TokenService);
export const provideToken = (): Provider => TokenService;

export const injectClient = () => inject(TRPC_PROVIDER);
export const provideClient = (): Provider => ({
  provide: TRPC_PROVIDER,
  useFactory: (tokenService: TokenService) => {
    const config = injectConfig();
    return createTRPCProxyClient<AppRouter>({
      links: [
        httpBatchLink({
          url: config.TRPC_URL,
          fetch(url, options) {
            return fetch(url, {
              ...options,
              credentials: 'include',
            });
          },
          headers() {
            return {
              Authorization: tokenService.getAccessToken(),
            };
          },
        }),
      ],
    });
  },
  deps: [TokenService],
});
