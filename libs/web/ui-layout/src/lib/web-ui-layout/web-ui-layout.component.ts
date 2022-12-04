import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'conduit-web-ui-layout',
  standalone: true,
  templateUrl: './web-ui-layout.component.html',
  styleUrls: ['./web-ui-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebUiLayoutComponent {}
