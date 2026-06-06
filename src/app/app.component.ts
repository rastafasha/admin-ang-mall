import { Component } from '@angular/core';
import { CongeneralService } from './services/congeneral.service';
import { PaypalService } from './services/paypal.service';
import { UsuarioService } from './services/usuario.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Meta } from '@angular/platform-browser';
import { SwUpdate } from '@angular/service-worker';

declare var jQuery:any;
declare var $:any;
@Component({
  selector: 'app-root',
  standalone:false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'admin';
  public congenerals : any = {};
  public url: any;
  public headers = false;

  constructor(
    private _congeneralService : CongeneralService,
    private paypalService: PaypalService,
    private usuarioService: UsuarioService,
    private swUpdate: SwUpdate,
    private _router : Router,
    private meta: Meta
    ){
      this._congeneralService.cargarCongenerals().subscribe( response =>{
        this.congenerals = response; this.url = environment.baseUrl;
        $('#favicon_icon').attr('href',this.url+'/congenerals/'+this.congenerals[0].favicon);
        $('#title_general').text(this.congenerals[0].titulo);
        // console.log(this.congenerals);
        // console.log(this.congenerals[0].titulo);
      },
         error=>{ } );
        this._congeneralService.cargarCongenerals().subscribe( response =>{
          this.congenerals = response; this.url = environment.baseUrl;
          $('#favicon_icon').attr('href',this.url+'/congenerals/'+this.congenerals[0].favicon);
          $('#title_general').text(this.congenerals[0].titulo);
        }, error=>{ } );

        const keywords: string[] = ['foo', 'bar', 'poo']
    this.meta.addTag({ name: 'keywords', content: keywords.join(',') });
  }

  ngOnInit(): void {
    window.scroll(0,0);

    // Lógica moderna de actualización PWA para Angular 19
    if (this.swUpdate.isEnabled) {
      
      // 1. Escuchar los eventos de actualización del Service Worker
      this.swUpdate.versionUpdates.subscribe((evt) => {
        switch (evt.type) {
          case 'VERSION_DETECTED':
            console.log('SW: Se está descargando una nueva versión en segundo plano...', evt.version.hash);
            break;
            
          case 'VERSION_READY':
            console.log('SW: Nueva versión lista para ser usada:', evt.latestVersion.hash);
            
            // Lanza el aviso al administrador para refrescar la PWA
            if (confirm('¡Hay una nueva actualización disponible de Zlipmenu! ¿Deseas recargar la página para ver los cambios?')) {
              // Aplica la actualización y recarga la pestaña automáticamente
              this.swUpdate.activateUpdate().then(() => {
                document.location.reload();
              });
            }
            break;

          case 'VERSION_INSTALLATION_FAILED':
            console.error('SW: Falló la instalación de la nueva versión:', evt.error);
            break;
        }
      });

      // 2. Forzar al navegador a revisar si el archivo ngsw.json cambió en Vercel
      this.swUpdate.checkForUpdate().then(hasUpdate => {
        if (hasUpdate) {
          console.log('SW: Se detectaron cambios en el servidor.');
        } else {
          console.log('SW: La aplicación está completamente al día.');
        }
      }).catch(err => {
        console.error('SW: Error al verificar actualizaciones:', err);
      });
    }
    
    // Tu lógica existente del SDK Dinámico de PayPal (Mantenla igual)
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
