import { Injectable } from '@angular/core';
import { User } from '@prisma/client';
import { BehaviorSubject } from 'rxjs';
import { IS_LOGGED_STORAGE_KEY } from './auth.config';

type UserCredential = Omit<User, 'password' | 'refreshToken'>;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly currentUser$ = new BehaviorSubject<null | UserCredential>(null);

  readonly user$ = this.currentUser$.asObservable();

  authenticateUser(user: UserCredential) {
    this.currentUser$.next(user);
    localStorage.setItem(IS_LOGGED_STORAGE_KEY, JSON.stringify(true));
  }

  isUserLoggedIn() {
    return localStorage.getItem(IS_LOGGED_STORAGE_KEY);
  }
}
