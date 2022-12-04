import { enableProdMode } from '@angular/core';
import { AppComponent } from './app/app.component';

(async () => {
  const config = await fetch('assets/config.json').then(r => r.json());
  if (process.env['NODE_ENV'] === 'production') {
    enableProdMode();
  }
  void AppComponent.bootstrap(config);
})();
