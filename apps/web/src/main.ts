import { AppComponent } from './app/app.component';

(async () => {
  const config = await fetch('assets/config.json').then(r => r.json());
  void AppComponent.bootstrap(config);
})();
