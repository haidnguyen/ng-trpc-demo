import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'conduit-web-feature-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './web-feature-login.component.html',
  styleUrls: ['./web-feature-login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebFeatureLoginComponent {}
