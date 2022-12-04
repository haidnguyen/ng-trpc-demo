import { inject, InjectionToken, Provider } from '@angular/core';
import type { AppRouter } from '@conduit/data-access/trpc';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';

const TRPC_PROVIDER = new InjectionToken<ReturnType<typeof createTRPCProxyClient<AppRouter>>>('__TRPC_PROVIDER__');

export const injectClient = () => inject(TRPC_PROVIDER);
export const provideClient = (url: string): Provider => ({
  provide: TRPC_PROVIDER,
  useFactory: () =>
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
        }),
      ],
    }),
});
