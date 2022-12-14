import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService, fromProcedure, injectClient, injectToken } from '@conduit/web/core';
import { Subject, takeUntil } from 'rxjs';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'conduit-web-ui-layout',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet],
  templateUrl: './web-ui-layout.component.html',
  styleUrls: ['./web-ui-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebUiLayoutComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly token = injectToken();
  private readonly client = injectClient();
  private readonly destroy$ = new Subject<void>();
  private readonly router = inject(Router);

  ngOnInit(): void {
    if (this.authService.isUserLoggedIn()) {
      fromProcedure(this.client.user.accessToken.query)()
        .pipe(takeUntil(this.destroy$))
        .subscribe(user => {
          this.token.setAccessToken(user.token);
          this.authService.authenticateUser(user);
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
