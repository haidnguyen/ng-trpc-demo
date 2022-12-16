import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@prisma/client';
import { BehaviorSubject, iif, map, NEVER, switchMap, tap } from 'rxjs';
import { fromProcedure } from '../client/utils';
import { injectClient, injectToken } from '../core.di';
import { IS_LOGGED_STORAGE_KEY } from './auth.config';

type UserData = Omit<User, 'password' | 'refreshToken'>;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly currentUser$ = new BehaviorSubject<null | UserData>(null);
  private readonly client = injectClient();
  private readonly router = inject(Router);
  private readonly token = injectToken();

  readonly user$ = this.currentUser$.asObservable();

  authenticateUser(user: UserData) {
    this.currentUser$.next(user);
    localStorage.setItem(IS_LOGGED_STORAGE_KEY, JSON.stringify(true));
  }

  isUserLoggedIn() {
    return JSON.parse(localStorage.getItem(IS_LOGGED_STORAGE_KEY) ?? 'false');
  }

  isAuth() {
    return this.currentUser$.pipe(map(user => !!user));
  }

  logout() {
    fromProcedure(this.client.auth.logout.mutate)().subscribe(response => {
      if (response.message === 'SUCCESS') {
        this.router.navigateByUrl('/home');
        this.currentUser$.next(null);
        localStorage.removeItem(IS_LOGGED_STORAGE_KEY);
      }
    });
  }

  login(credential: Pick<User, 'email' | 'password'>) {
    return fromProcedure(this.client.auth.login.query)(credential).pipe(
      tap(response => {
        this.token.setAccessToken(response.token);
      }),
      switchMap(response => iif(() => !!response.token, fromProcedure(this.client.user.me.query)().pipe(), NEVER)),
      tap(user => {
        this.authenticateUser(user);
      })
    );
  }

  getAccess() {
    return fromProcedure(this.client.auth.accessToken.query)().pipe(
      tap(response => {
        this.token.setAccessToken(response.token);
      }),
      switchMap(response => iif(() => !!response.token, fromProcedure(this.client.user.me.query)(), NEVER)),
      tap(user => {
        this.authenticateUser(user);
      })
    );
  }

  clearStorage() {
    localStorage.removeItem(IS_LOGGED_STORAGE_KEY);
  }
}
