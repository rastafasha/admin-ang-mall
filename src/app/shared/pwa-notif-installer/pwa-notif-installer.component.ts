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
    // The CDK has specific checks for Chrome on Android
    this.isAndroid = this.platform.ANDROID;

    // console.log('Is iOS:', this.isIOS);
    // console.log('Is Android:', this.isAndroid);
    if (this.isAndroid) {
      this.loadModalPwa()
    }

    if (this.isIOS) {
      this.loadModalPwa()
    }
  }

  ngOnInit(): void {
    this.initPwa();
  }

  initPwa() {
    this.updateOnlineStatus();

    if (this.swUpdate.isEnabled) {
      // Filtrar explícitamente el evento para Angular 19
      this.swUpdate.versionUpdates.subscribe((evt) => {
        // VERSION_READY significa que los archivos nuevos ya están en el caché del cliente
        if (evt.type === 'VERSION_READY') {
          console.log('SW: Nueva versión descargada y lista para activar.');
          this.modalVersion = true; // Aquí es el momento seguro de prender tus banners
        }
      });

      // Fuerza a la PWA a buscar cambios en el servidor de inmediato
      this.swUpdate.checkForUpdate().catch(err => console.error('Error buscando update:', err));
    }
    this.loadModalPwa();
  }



  private updateOnlineStatus(): void {
    this.isOnline = window.navigator.onLine;
    // console.info(`isOnline=[${this.isOnline}]`);
  }

  public updateVersion(): void {
    this.swUpdate.activateUpdate().then(() => {
      // Esto intercambia los archivos viejos por los nuevos internamente
      window.location.reload();
    });
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
    this.modalPwaEvent.prompt();
    this.modalPwaPlatform = undefined;
  }

  public closePwa(): void {
    this.modalPwaPlatform = undefined;
  }
  // pwa

}
