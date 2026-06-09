import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import '@angular/compiler';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .then(() => {
    // Angular Service Worker (ngsw) se registra automáticamente con:
    // - serviceWorker: true en angular.json
    // - @angular/service-worker en el AppModule
    // No se registra manualmente para evitar conflicts (especialmente en iOS/PWA).
  })
  .catch(err => console.error(err));
