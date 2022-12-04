import { RouterOutlet } from '@angular/router';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { fromProcedure, injectClient } from '@conduit/web/trpc';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  standalone: true,
  imports: [RouterOutlet, NgIf, AsyncPipe],
  selector: 'conduit-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly #client = injectClient();

  readonly user$ = fromProcedure(this.#client.user.getUser.query)('Hai HAHAHA');
}
