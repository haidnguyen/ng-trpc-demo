import { RouterOutlet } from '@angular/router';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { WebUiLayoutComponent } from '@conduit/web/ui-layout';

@Component({
  standalone: true,
  imports: [RouterOutlet, NgIf, AsyncPipe, WebUiLayoutComponent],
  selector: 'conduit-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
