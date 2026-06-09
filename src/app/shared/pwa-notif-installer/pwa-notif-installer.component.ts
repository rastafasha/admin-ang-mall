import { Platform } from '@angular/cdk/platform';
import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-pwa-notif-installer',
  standalone: false,
  templateUrl: './pwa-notif-installer.component.html',
  styleUrls: ['./pwa-notif-installer.component.css']
})
export class PwaNotifInstallerComponent implements OnInit {

  // pwa
  isOnline: boolean;
  modalVersion: boolean;
  modalPwaEvent: any;
  modalPwaPlatform: string | undefined;

  isIOS: boolean;
  isAndroid: boolean;

  constructor(
    private swUpdate: SwUpdate,
    private platform: Platform,
  ) {
    this.isOnline = false;
    this.modalVersion = false;

    this.isIOS = this.platform.IOS;
    this.isAndroid = this.platform.ANDROID;

    if (this.isAndroid) {
      this.loadModalPwa();
    }

    if (this.isIOS) {
      this.loadModalPwa();
    }
  }

  ngOnInit(): void {
    this.initPwa();
  }

  initPwa() {
    this.updateOnlineStatus();

    // 🚀 ESCUDO DE PROTECCIÓN: Validamos que el Service Worker de actualización esté activo y soportado
    if (this.swUpdate && this.swUpdate.isEnabled) {
      
      this.swUpdate.versionUpdates.subscribe({
        next: (evt) => {
          if (evt.type === 'VERSION_READY') {
            console.log('SW: Nueva versión descargada y lista para activar.');
            this.modalVersion = true; 
          }
        },
        error: (err) => console.error('SW: Error escuchando eventos de actualización:', err)
      });

      this.swUpdate.checkForUpdate().catch(err => {
        console.warn('SW: No se pudo verificar la actualización automática en este entorno:', err.message);
      });

    } else {
      console.log('PwaNotifInstaller: SwUpdate no está habilitado o soportado en este dispositivo.');
    }
    
    this.loadModalPwa();
  }

  private updateOnlineStatus(): void {
    this.isOnline = window.navigator?.onLine || false;
  }

  public updateVersion(): void {
    // Protección extra por seguridad si presionan el botón de actualizar
    if (this.swUpdate && this.swUpdate.isEnabled) {
      this.swUpdate.activateUpdate().then(() => {
        window.location.reload();
      }).catch(err => {
        console.error('Error al activar actualización:', err);
        window.location.reload(); // Caída controlada: recarga igualmente
      });
    } else {
      window.location.reload();
    }
  }

  public closeVersion(): void {
    this.modalVersion = false;
  }

  private loadModalPwa(): void {
    if (this.platform.ANDROID) {
      window.addEventListener('beforeinstallprompt', (event: any) => {
        event.preventDefault();
        this.modalPwaEvent = event;
        this.modalPwaPlatform = 'ANDROID';
      });
    }

    if (this.platform.IOS && this.platform.SAFARI) {
      const isInStandaloneMode = ('standalone' in window.navigator) && ((<any>window.navigator)['standalone']);
      if (!isInStandaloneMode) {
        this.modalPwaPlatform = 'IOS';
      }
    }
  }

  public addToHomeScreen(): void {
    if (this.modalPwaEvent) {
      this.modalPwaEvent.prompt();
    }
    this.modalPwaPlatform = undefined;
  }

  public closePwa(): void {
    this.modalPwaPlatform = undefined;
  }
}
