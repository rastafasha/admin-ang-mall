import { Platform } from '@angular/cdk/platform';
import { Component, OnInit, HostListener } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';

@Component({
  selector: 'app-pwa-notif-installer',
  standalone: false,
  templateUrl: './pwa-notif-installer.component.html',
  styleUrls: ['./pwa-notif-installer.component.css']
})
export class PwaNotifInstallerComponent implements OnInit {

  // pwa
  isOnline: boolean = false;
  modalVersion: boolean = false;
  modalPwaEvent: any = null;
  modalPwaPlatform: string | undefined = undefined;

  isIOS: boolean;
  isAndroid: boolean;

  constructor(
    private swUpdate: SwUpdate,
    private platform: Platform,
  ) { 
    this.isIOS = this.platform.IOS;
    this.isAndroid = this.platform.ANDROID; 
    
    // TRUCO CLAVE 1: Capturar el evento de instalación global inmediatamente
    // antes de que cualquier otra lógica de Angular inicialice.
    this.escucharInstalacionGlobal();
  }

  ngOnInit(): void {
    this.initPwa();
  }

  private escucharInstalacionGlobal(): void {
    if (this.platform.ANDROID) {
      window.addEventListener('beforeinstallprompt', (event: any) => {
        event.preventDefault();
        this.modalPwaEvent = event;
        this.modalPwaPlatform = 'ANDROID';
      });
    }
  }

  initPwa() {
    this.updateOnlineStatus();

    if (this.swUpdate.isEnabled) {
      // Escucha limpia cuando Render avise que hay archivos nuevos
      this.swUpdate.versionUpdates.pipe(
        filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY')
      ).subscribe(() => {
        this.modalVersion = true; // Abre tu modal HTML de actualización
      });

      // TRUCO CLAVE 2: Le damos 2 segundos a la app para que cargue en Render 
      // antes de forzar la búsqueda de actualizaciones. Evita que se tranque.
      setTimeout(() => {
        this.swUpdate.checkForUpdate().catch(err => console.error("Error SW:", err));
      }, 2000);
    }

    this.checkIOSStandalone();
  }

  private updateOnlineStatus(): void {
    this.isOnline = window.navigator.onLine;
  }

  // Se ejecuta al darle "Aceptar" en tu cartel de actualización
  public updateVersion(): void {
    this.swUpdate.activateUpdate().then(() => {
      window.location.reload(); // Intercambia caché vieja por nueva de golpe
    });
  }

  public closeVersion(): void {
    this.modalVersion = false;
  }

  // TRUCO CLAVE 3: Simplificación de detección para iOS en Angular 19
  private checkIOSStandalone(): void {
    if (this.isIOS) {
      const isInStandaloneMode = ('standalone' in window.navigator) && ((window.navigator as any).standalone);
      if (!isInStandaloneMode) {
        this.modalPwaPlatform = 'IOS'; // Muestra la guía de "Añadir a inicio" en iPhone
      }
    }
  }

  public addToHomeScreen(): void {
    if (this.modalPwaEvent) {
      this.modalPwaEvent.prompt();
      this.modalPwaEvent.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          this.modalPwaPlatform = undefined;
        }
      });
    }
  }

  public closePwa(): void {
    this.modalPwaPlatform = undefined;
  }


}
