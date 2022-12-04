import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { injectClient } from '@conduit/web/trpc';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'conduit-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'web';
  readonly #client = injectClient();
}
