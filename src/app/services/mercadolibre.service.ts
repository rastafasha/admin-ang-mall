import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MercadoLibreConfig, MeliConfigResponse, MeliUrlResponse, MeliSyncResponse } from '../models/mercadoliobre.model';

@Injectable({
  providedIn: 'root'
})
export class MercadolibreService {

  // Obtiene la URL base de tu API (ej: 'https://tusaas.com') desde los environments de Angular
  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  /**
   * Helper para obtener los headers de autenticación nativos de tu SaaS
   */
  get headers() {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'x-token': token // Asegúrate de usar la clave exacta que espera tu backend (ej: 'x-token' o 'Authorization')
    });
  }

  /**
   * 📤 Guarda o actualiza las credenciales de la App de Mercado Libre de este comercio.
   * Envía datos a: POST /api/ml/config
   */
  guardarConfiguracion(config: MercadoLibreConfig): Observable<MeliConfigResponse> {
    const url = `${this.baseUrl}/meli/config/store`;
    return this.http.post<MeliConfigResponse>(url, config, { headers: this.headers });
  }

  /**
   * 📥 Obtiene la configuración técnica y el estatus actual de integración de la tienda logueada.
   * Envía datos a: GET /api/ml/config
   */
  obtenerConfiguracion(): Observable<MeliConfigResponse> {
    const url = `${this.baseUrl}/meli/config/get`;
    return this.http.get<MeliConfigResponse>(url, { headers: this.headers });
  }

  /**
   * 🌍 Solicita al backend la generación de la URL OAuth regional dinámica (según el país de la tienda).
   * Envía datos a: GET /api/ml/url-vinculacion (o la ruta que definiste para obtenerUrlVinculacionML)
   */
  obtenerUrlVinculacion(tiendaId:string): Observable<MeliUrlResponse> {
    const url = `${this.baseUrl}/meli/url-vinculacion/${tiendaId}`;
    return this.http.get<MeliUrlResponse>(url, { headers: this.headers });
  }
 
  obtenerGraficoResumen(tiendaId:string): Observable<MeliUrlResponse> {
    const url = `${this.baseUrl}/meli/resumen/${tiendaId}`;
    return this.http.get<MeliUrlResponse>(url, { headers: this.headers });
  }

  /**
   * 🚀 Dispara manualmente la exportación o actualización completa de un producto hacia Mercado Libre.
   * Envía datos a: POST /api/producto/exportar-mercadolibre/:id_producto
   */
  exportarProducto(idProducto: string): Observable<MeliSyncResponse> {
    const url = `${this.baseUrl}/productos/exportar-mercadolibre/${idProducto}`;
    return this.http.post<MeliSyncResponse>(url, {}, { headers: this.headers  });
  }
}
