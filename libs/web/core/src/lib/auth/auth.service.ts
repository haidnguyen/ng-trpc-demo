import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@prisma/client';
import { BehaviorSubject, map } from 'rxjs';
import { fromProcedure } from '../client/utils';
import { injectClient } from '../core.di';
import { IS_LOGGED_STORAGE_KEY } from './auth.config';

type UserData = Omit<User, 'password' | 'refreshToken'>;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly currentUser$ = new BehaviorSubject<null | UserData>(null);
  private readonly client = injectClient();
  private readonly router = inject(Router);

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
    fromProcedure(this.client.user.userLogout.query)().subscribe(response => {
      if (response.message === 'SUCCESS') {
        this.router.navigateByUrl('/home');
        this.currentUser$.next(null);
        localStorage.removeItem(IS_LOGGED_STORAGE_KEY);
      }
    });
  }
}
