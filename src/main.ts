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
    // Si el navegador soporta Service Workers y estamos en producción, lo registramos a la fuerza
    if ('serviceWorker' in navigator && environment.production) {
      // CORRECCIÓN: Quitamos el '/' inicial para que la ruta sea relativa 'ngsw-worker.js'
      navigator.serviceWorker.register('ngsw-worker.js')
        .then(() => console.log('🚀 Service Worker registrado manualmente con éxito'))
        .catch(err => console.error('Error registrando SW:', err));
    }
  })
  .catch(err => console.error(err));
