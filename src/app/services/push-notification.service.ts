import { inject, Injectable, Injector } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

const claveVapidApi = environment.VAPI_KEY_PUBLIC;
const urlBackend = environment.urlBackedNotification;
const base_url = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  readonly VAPID_PUBLIC_KEY = claveVapidApi;
  readonly urlBackedNotification = environment.urlBackedNotification;

  private swPush: SwPush | null = null;
  private http = inject(HttpClient);
  public toastr = inject(ToastrService);
  public router = inject(Router);
  
  public isSubscribed$ = new BehaviorSubject<boolean>(false);
  public isProcessing$ = new BehaviorSubject<boolean>(false);



  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  constructor(private injector: Injector) {
   // 🚀 EL ESCUDO DEFINITIVO: Solo instanciamos el servicio nativo si el navegador lo soporta de verdad
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      // Inyección perezosa (lazy load): solo se crea si el entorno es compatible
      this.swPush = this.injector.get(SwPush);

      this.checkSubscriptionStatus();
      this.checkInitialStatus();
    } catch (e) {
      console.warn('No se pudo inicializar SwPush nativo de Angular:', e);
    }
  } else {
    console.log('PushNotificationService: Notificaciones omitidas de forma segura en este entorno.');
    this.isSubscribed$.next(false);
  }
  }

  async checkInitialStatus() {
    try {
      const reg = await navigator.serviceWorker.ready;
      // Validamos estrictamente que pushManager exista en el móvil antes de llamar al método
      if (reg && reg.pushManager) {
        const sub = await reg.pushManager.getSubscription();
        this.isSubscribed$.next(!!sub);
      } else {
        this.isSubscribed$.next(false);
      }
    } catch (err) {
      console.error('Error en checkInitialStatus:', err);
      this.isSubscribed$.next(false);
    }
  }

  setSubscriptionStatus(status: boolean) {
    this.isSubscribed$.next(status);
  }

  async checkSubscriptionStatus() {
    try {
      const reg = await navigator.serviceWorker.ready;
      // Validamos estrictamente que pushManager exista en el móvil antes de llamar al método
      if (reg && reg.pushManager) {
        const sub = await reg.pushManager.getSubscription();
        this.isSubscribed$.next(!!sub);
      } else {
        this.isSubscribed$.next(false);
      }
    } catch (err) {
      console.error('Error en checkSubscriptionStatus:', err);
      this.isSubscribed$.next(false);
    }
  }

  subscribeToNotifications() {
    // 🚀 VALIDACIÓN ULTRA SEGURA: Evita leer propiedades de un objeto null o undefined
  if (!this.swPush || !this.swPush.isEnabled) {
    this.toastr.warning('No soportado', 'Tu navegador actual no admite notificaciones push.');
    return;
  }

    this.isProcessing$.next(true);

    this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
    })
      .then(sub => {
        const miToken = localStorage.getItem('token') || '';
        const headers = { 'x-token': miToken };

        console.log('Enviando con token:', miToken);

        this.http.post(this.urlBackedNotification, sub, { headers }).subscribe({
          next: () => {
            console.log('✅ ¡Suscripción guardada con éxito!');
            this.isSubscribed$.next(true);
            this.isProcessing$.next(false);
            this.toastr.success('¡Notificaciones activadas!');
          },
          error: err => {
            console.error('❌ Error al guardar la suscripción:', err);
            this.isProcessing$.next(false);
            this.toastr.error('Error', 'No se pudo registrar el dispositivo en el servidor');
          }
        });
      })
      .catch(err => {
        // 🚀 PARCHE DEFINITIVO: Manejo seguro y aislado del error para producción
        console.warn('El usuario rechazó las notificaciones o el navegador lo bloqueó:', err);

        // Evitamos llamadas directas encadenadas si los BehaviorSubjects están en proceso de destrucción
        setTimeout(() => {
          if (this.isProcessing$) this.isProcessing$.next(false);
          if (this.isSubscribed$) this.isSubscribed$.next(false);
          if (this.toastr) {
            this.toastr.warning('Permiso denegado', 'Debes permitir las notificaciones en el navegador para activarlas.');
          }
        }, 0);
      });
  }

  guardarPushSubscription(subcripcion: any) {
    const url = `${this.urlBackedNotification}`;
    return this.http.post(url, subcripcion, this.headers);
  }
}
