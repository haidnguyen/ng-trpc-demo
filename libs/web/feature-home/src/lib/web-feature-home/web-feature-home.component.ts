import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { fromProcedure, injectClient } from '@conduit/web/trpc';

@Component({
  selector: 'conduit-web-feature-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './web-feature-home.component.html',
  styleUrls: ['./web-feature-home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebFeatureHomeComponent {
  private readonly client = injectClient();

  test() {
    fromProcedure(this.client.user.userCreate.mutate)({
      email: 'dinhhai281@gmail.com',
      username: 'dinhhai281',
      password: '123456',
      bio: 'This is my bio',
    }).subscribe(user => {
      console.log({ user });
    });
  }
}
