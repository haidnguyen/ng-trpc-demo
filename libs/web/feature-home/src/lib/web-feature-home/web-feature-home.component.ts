import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'conduit-web-feature-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './web-feature-home.component.html',
  styleUrls: ['./web-feature-home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebFeatureHomeComponent {}
