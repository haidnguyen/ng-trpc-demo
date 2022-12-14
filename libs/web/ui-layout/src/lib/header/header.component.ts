import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '@conduit/web/core';
import { LetModule } from '@ngrx/component';
import { combineLatest, map } from 'rxjs';

@Component({
  selector: 'conduit-header',
  standalone: true,
  imports: [RouterModule, LetModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private readonly authService = inject(AuthService);

  readonly vm$ = combineLatest([this.authService.isAuth(), this.authService.user$]).pipe(
    map(([isAuth, user]) => {
      return {
        isAuth,
        user,
      };
    })
  );

  onLogout() {
    this.authService.logout();
  }
}
