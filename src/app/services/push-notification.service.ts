import { inject, Injectable, Injector } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

const claveVapidApi = environment.VAPI_KEY_PUBLIC;
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

  // ⚠️ REVISA AQUÍ: Usa la misma llave que en AccountService ('auth_token' o 'token')
  get token(): string {
    return localStorage.getItem('auth_token') || localStorage.getItem('token') || '';
  }



  get headers() {
    return {
      headers: {
        'x-token': this.token,
        'auth_token': this.token // Enviamos ambos por compatibilidad mientras verificas tu backend
      }
    };
  }
  constructor(private injector: Injector) {
    // 🚀 EL ESCUDO DEFINITIVO: Solo instanciamos el servicio nativo si el navegador lo soporta de verdad
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        this.swPush = this.injector.get(SwPush);
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
    await this.checkSubscriptionStatus();
  }

  setSubscriptionStatus(status: boolean) {
    this.isSubscribed$.next(status);
  }

  async checkSubscriptionStatus() {
    try {
      const reg = await navigator.serviceWorker.ready;
      if (reg && reg.pushManager) {
        const sub = await reg.pushManager.getSubscription();

        if (sub && this.token) {
          // Enviamos silencioso: true para reasignar el dueño sin spamear bienvenida
          await firstValueFrom(
            this.http.post(this.urlBackedNotification, { subscription: sub, silencioso: true }, this.headers)
          );
          this.isSubscribed$.next(true);
        } else {
          this.isSubscribed$.next(false);
        }
      } else {
        this.isSubscribed$.next(false);
      }
    } catch (err) {
      console.error('Error en checkSubscriptionStatus:', err);
      this.isSubscribed$.next(false);
    }
  }

  subscribeToNotifications() {
    if (!this.swPush || !this.swPush.isEnabled) {
      this.toastr.warning('No soportado', 'Tu navegador actual no admite notificaciones push.');
      return;
    }

    if (!this.token) {
      this.toastr.warning('Inicia sesión', 'Debes iniciar sesión para activar las notificaciones.');
      return;
    }

    this.isProcessing$.next(true);

    this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
    })
      .then(sub => {
        console.log('Enviando con token:', this.token);

        this.guardarPushSubscription(sub).subscribe({
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

  /**
   * Nuevo método opcional para llamar al hacer Logout y desvincular el navegador
   */
 async unsubscribeOnLogout() {
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg?.pushManager?.getSubscription();
      
      if (sub) {
        // 1. Avisamos al backend usando base_url + /notipush/delete-subscription
        if (this.token) {
          await firstValueFrom(
            this.http.post(
              `${base_url}/notipush/delete-subscription`, 
              { endpoint: sub.endpoint }, 
              this.headers
            )
          ).catch(err => console.warn('No se pudo eliminar en servidor:', err));
        }

        // 2. Desuscribimos el navegador localmente
        await sub.unsubscribe();
      }
    } catch (error) {
      console.error('Error al desuscribir en logout:', error);
    } finally {
      this.isSubscribed$.next(false);
    }
  }
}
