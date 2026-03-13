import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Paypal } from '../models/paypal.model';
import { map, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
const base_url = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class PaypalService {

  paypal: Paypal;

  constructor(
    private http: HttpClient,
    @Inject(DOCUMENT) private document: Document
  ) { }

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


  getPaypals() {

    const url = `${base_url}/paypal/`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp: { ok: boolean, paypals: Paypal[] }) => resp.paypals)
      )

  }

  getPaypalById(_id: string) {
    const url = `${base_url}/paypal/${_id}`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp: { ok: boolean, paypal: Paypal }) => resp.paypal)
      );

  }

  getPaypalByTiendaId(_id: string) {
    const url = `${base_url}/paypal/tienda/${_id}`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp: { ok: boolean, paypals: Paypal[] }) => resp.paypals)
      );

  }

  crearPaypal(paypal: any) {
    const url = `${base_url}/paypal/store`;
    return this.http.post(url, paypal, this.headers);
  }



  actualizarPaypal(paypal: Paypal) {
    const url = `${base_url}/paypal/update/${paypal._id}`;
    return this.http.put(url, paypal, this.headers);
  }

  borrarPaypal(_id: string) {
    const url = `${base_url}/paypal/remove/${_id}`;
    return this.http.delete(url, this.headers);
  }

  loadGlobalPaypalSDK(tiendaId: string) {
    return this.getPaypalByTiendaId(tiendaId).pipe(
      switchMap(paypals => {
        if (!paypals || paypals.length === 0) {
          console.warn('No PayPal config for tienda', tiendaId);
          return;
        }
        const paypal = paypals[0];
        (window as any).PAYPAL_CONFIG = paypal;

        // Remove existing PayPal script if any
        const existing = this.document.querySelector('script[src*="paypal.com/sdk/js"]') as HTMLScriptElement;
        if (existing) {
          existing.remove();
        }

        // Create new dynamic script
        const script = this.document.createElement('script');
        script.src = `https://www.paypal.com/sdk/js?client-id=${paypal.clientIdPaypal}`;
        script.async = true;
        this.document.head.appendChild(script);
        
        console.log('PayPal SDK loaded with client ID:', paypal.clientIdPaypal);
        return of(paypal);
      })
    );
  }

}
