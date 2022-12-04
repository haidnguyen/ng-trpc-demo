import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, fromProcedure, injectClient, injectToken } from '@conduit/web/core';
import { NEVER, Subject, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'conduit-web-feature-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './web-feature-home.component.html',
  styleUrls: ['./web-feature-home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebFeatureHomeComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly client = injectClient();
  private readonly token = injectToken();
  private readonly destroy$ = new Subject<void>();

  readonly user$ = this.authService.user$;

  ngOnInit() {
    this.user$
      .pipe(
        switchMap(currentUser => {
          if (this.authService.isUserLoggedIn() && !currentUser) {
            return fromProcedure(this.client.user.accessToken.query)();
          }
          return NEVER;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(user => {
        if (user) {
          this.token.setAccessToken(user.token);
          this.authService.authenticateUser(user);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
