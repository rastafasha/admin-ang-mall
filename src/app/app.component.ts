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
    // Las configuraciones fijas se quedan en el constructor
    const keywords: string[] = ['foo', 'bar', 'poo'];
    this.meta.addTag({ name: 'keywords', content: keywords.join(',') });
  }

  ngOnInit(): void {
    window.scroll(0, 0);

    // MOVIDO AQUÍ: Cargar los datos generales de forma segura cuando el HTML ya existe en el móvil
    this._congeneralService.cargarCongenerals().subscribe({
      next: (response) => {
        this.congenerals = response; 
        this.url = environment.baseUrl;
        
        // Verificación de seguridad para evitar que explote si la base de datos viene vacía
        if (this.congenerals && this.congenerals[0]) {
          $('#favicon_icon').attr('href', this.url + '/congenerals/' + this.congenerals[0].favicon);
          $('#title_general').text(this.congenerals[0].titulo);
        }
      },
      error: (err) => {
        console.error('Error al cargar configuraciones generales del backend:', err);
      }
    });

    // Lógica moderna de actualización PWA para Angular 19 (Protegida contra bloqueos)
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates.subscribe((evt) => {
        switch (evt.type) {
          case 'VERSION_DETECTED':
            console.log('SW: Se está descargando una nueva versión...', evt.version.hash);
            break;
            
          case 'VERSION_READY':
            console.log('SW: Nueva versión lista:', evt.latestVersion.hash);
            if (confirm('¡Hay una nueva actualización disponible de Zlipmenu! ¿Deseas recargar la página?')) {
              this.swUpdate.activateUpdate().then(() => {
                document.location.reload();
              });
            }
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
    
    // Tu lógica existente del SDK Dinámico de PayPal
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
