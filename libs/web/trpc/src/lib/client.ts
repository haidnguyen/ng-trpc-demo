import { inject, InjectionToken, Provider } from '@angular/core';
import type { AppRouter } from '@conduit/data-access/trpc';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import { TokenService } from './token.service';

const TRPC_PROVIDER = new InjectionToken<ReturnType<typeof createTRPCProxyClient<AppRouter>>>('__TRPC_PROVIDER__');

export const injectTokenController = () => inject(TokenService);
export const provideToken = (): Provider => TokenService;

export const injectClient = () => inject(TRPC_PROVIDER);
export const provideClient = (url: string): Provider => ({
  provide: TRPC_PROVIDER,
  useFactory: (tokenService: TokenService) =>
    createTRPCProxyClient<AppRouter>({
      links: [
        httpBatchLink({
          url,
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
    }),
  deps: [TokenService],
});
