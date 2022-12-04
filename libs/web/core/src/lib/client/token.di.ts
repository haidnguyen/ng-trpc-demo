import { inject, Injectable, Provider } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class TokenService {
  private readonly accessToken$ = new BehaviorSubject<string | null>(null);

  setAccessToken(token: string) {
    this.accessToken$.next(token);
  }

  getAccessToken() {
    return this.accessToken$.getValue() ?? '';
  }
}

export const injectToken = () => inject(TokenService);
export const provideToken = (): Provider => TokenService;
