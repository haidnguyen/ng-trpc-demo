import { ChangeDetectionStrategy, Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouterOutlet, withEnabledBlockingInitialNavigation } from '@angular/router';
import { AppConfig, provideCore } from '@conduit/web/core';
import { appRoutes } from './app.routes';

@Component({
  standalone: true,
  imports: [RouterOutlet],
  selector: 'conduit-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  static bootstrap(config: AppConfig) {
    return bootstrapApplication(this, {
      providers: [provideRouter(appRoutes, withEnabledBlockingInitialNavigation()), provideCore(config)],
    }).catch(err => console.error(err));
  }
}
