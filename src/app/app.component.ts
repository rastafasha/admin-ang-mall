import { Component, OnInit } from '@angular/core';
import { CongeneralService } from './services/congeneral.service';
import { PaypalService } from './services/paypal.service';
import { UsuarioService } from './services/usuario.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Meta } from '@angular/platform-browser';
import { SwUpdate } from '@angular/service-worker';

declare var $: any;

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'admin';
  public congenerals: any = {};
  public url: any;
  public headers = false;

  constructor(
    private _congeneralService: CongeneralService,
    private paypalService: PaypalService,
    private usuarioService: UsuarioService,
    private swUpdate: SwUpdate,
    private _router: Router,
    private meta: Meta
  ) {
    const keywords: string[] = ['foo', 'bar', 'poo'];
    this.meta.addTag({ name: 'keywords', content: keywords.join(',') });
  }

  ngOnInit(): void {
    window.scroll(0, 0);

    // =========================================================================
    // 🟢 LOGS DE SEGUIMIENTO PARA EL SERVICE WORKER EN EL RAÍZ
    // =========================================================================
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates.subscribe((evt) => {
        switch (evt.type) {
          case 'VERSION_DETECTED':
            console.log('SW: Se está descargando una nueva versión...', evt.version.hash);
            break;
            
          case 'VERSION_READY':
            // 🟢 SOLUCIÓN: Eliminamos el alert confirm() molesto. 
            // Ahora dejamos que tu componente 'pwa-notif-installer' maneje el modal estético de forma exclusiva.
            console.log('SW: Nueva versión lista en el servidor:', evt.latestVersion.hash);
            break;

          case 'VERSION_INSTALLATION_FAILED':
            console.error('SW: Falló la instalación:', evt.error);
            break;
        }
      });

      this.swUpdate.checkForUpdate().then(hasUpdate => {
        if (hasUpdate) console.log('SW: Cambios detectados en el servidor.');
      }).catch(err => {
        console.error('SW: Error al verificar actualizaciones:', err);
      });
    }
    
    // Lógica existente del SDK Dinámico de PayPal
    if (this.usuarioService.usuario?.local) {
      const tiendaId = typeof this.usuarioService.usuario.local === 'string' 
        ? this.usuarioService.usuario.local 
        : (this.usuarioService.usuario.local as any)._id;
      this.paypalService.loadGlobalPaypalSDK(tiendaId).subscribe({
        next: (paypal) => console.log('Dynamic PayPal loaded:', paypal),
        error: (err) => console.error('PayPal load failed:', err)
      });
    }
  }
}
