import { inject, Injectable } from '@angular/core';
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

  private swPush = inject(SwPush);
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

  constructor() {
    // Parche de seguridad para entornos globales
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      this.checkSubscriptionStatus();
      this.checkInitialStatus();
    } else {
      console.warn('PushNotificationService: Las notificaciones no son soportadas en este dispositivo/navegador.');
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
    // Validamos que el navegador móvil realmente tenga la capacidad de suscribirse
    if (!('serviceWorker' in navigator) || !this.swPush.isEnabled) {
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
      console.warn('El usuario rechazó las notificaciones o el navegador lo bloqueó:', err);
      this.isProcessing$.next(false);
      this.toastr.warning('Permiso denegado', 'Debes permitir las notificaciones en el navegador para activarlas.');
    });
  }

  guardarPushSubscription(subcripcion: any) {
    const url = `${this.urlBackedNotification}`;
    return this.http.post(url, subcripcion, this.headers);
  }
}
