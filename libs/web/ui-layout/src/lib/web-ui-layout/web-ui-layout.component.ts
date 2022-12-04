import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'conduit-web-ui-layout',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './web-ui-layout.component.html',
  styleUrls: ['./web-ui-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebUiLayoutComponent {}
