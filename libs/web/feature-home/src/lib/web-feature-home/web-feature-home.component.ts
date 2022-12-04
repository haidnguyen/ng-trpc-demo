import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@conduit/web/core';

@Component({
  selector: 'conduit-web-feature-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './web-feature-home.component.html',
  styleUrls: ['./web-feature-home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebFeatureHomeComponent {
  private readonly authService = inject(AuthService);

  readonly user$ = this.authService.user$;
}
