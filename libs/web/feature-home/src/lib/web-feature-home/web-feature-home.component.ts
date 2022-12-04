import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
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
export class WebFeatureHomeComponent implements OnInit {
  private readonly client = injectClient();

  ngOnInit() {
    fromProcedure(this.client.user.userCreate.mutate)({
      name: 'Hai',
      email: 'dinhhai281@gmail.com',
    }).subscribe(response => {
      console.log(response);
    });
  }
}
