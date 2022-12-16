import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '@conduit/web/core';
import { Subject } from 'rxjs';
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
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    if (this.authService.isUserLoggedIn()) {
      this.authService.getAccess().subscribe({
        error: (err: Error) => {
          console.log(err.message);
        },
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
