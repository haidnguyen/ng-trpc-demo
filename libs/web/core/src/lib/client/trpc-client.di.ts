import { inject, InjectionToken, Provider } from '@angular/core';
import type { AppRouter } from '@conduit/data-access/trpc';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import { injectConfig } from '../config/config.di';
import { injectToken } from './token.di';

const TRPC_PROVIDER = new InjectionToken<ReturnType<typeof createTRPCProxyClient<AppRouter>>>('__TRPC_PROVIDER__');
export const injectClient = () => inject(TRPC_PROVIDER);
export const provideClient = (): Provider => ({
  provide: TRPC_PROVIDER,
  useFactory: () => {
    const config = injectConfig();
    const token = injectToken();
    return createTRPCProxyClient<AppRouter>({
      links: [
        httpBatchLink({
          url: config.TRPC_URL,
          async fetch(url, options) {
            const response = await fetch(url, { ...options, credentials: 'include' });
            if (!response.ok) {
              const json = await response.json();
              const message = json[0].error.message;
              if (message === 'TOKEN_EXPIRED') {
                const refreshUrl = `${config.TRPC_URL}/auth.accessToken?batch=1&input={}`;
                const refreshResponse = await fetch(refreshUrl, { credentials: 'include' });
                const refreshJson = await refreshResponse.json();
                const accessToken = refreshJson[0].result.data.token;
                token.setAccessToken(accessToken);

                return await fetch(url, {
                  ...options,
                  credentials: 'include',
                  headers: {
                    ...options?.headers,
                    Authorization: accessToken,
                  },
                });
              }
            }
            return response;
          },
          headers() {
            return {
              Authorization: token.getAccessToken(),
            };
          },
        }),
      ],
    });
  },
});
