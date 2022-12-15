import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@conduit/web/core';

@Component({
  selector: 'conduit-web-feature-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './web-feature-settings.component.html',
  styleUrls: ['./web-feature-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class WebFeatureSettingsComponent {
  private readonly authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }
}
