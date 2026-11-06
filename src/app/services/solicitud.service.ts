import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Solicitud } from '../models/solicitud.model';

const url_servicios = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {

  constructor(
    public http: HttpClient,

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

  list() {
    const url = `${url_servicios}/solicitudes`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp: { ok: boolean, solicitudes: Solicitud }) => resp.solicitudes)
      )
  }


  getSolicitud(_id: any) {
    const url = `${url_servicios}/solicitudes/${_id}`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp: { ok: boolean, solicitud: Solicitud }) => resp.solicitud)
      );
  }

  getSolicitudByUser(usuario: any, page: number = 1, limit: number = 6,) {
    // Construimos la URL con parámetros de paginación
    const url = `${url_servicios}/solicitudes/user/${usuario}?page=${page}&limit=${limit}`;

    return this.http.get<any>(url, this.headers)
      .pipe(
        // Importante: Si la API devuelve un array, asegúrate que el tipado sea Payment[]
        map((resp: { ok: boolean, solicitudes: any[] }) => resp.solicitudes)
      );
  }

  getByTiendaId(_id: string) {
    const url = `${url_servicios}/solicitudes/by_tiendaId/${_id}`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp: { ok: boolean, solicitudes: Solicitud[] }) => resp.solicitudes)
      );

  }

  createSolicitud(solicitud: any) {
    const url = `${url_servicios}/solicitudes/crear`;
    return this.http.post(url, solicitud, this.headers);
  }
  editSolicitud(data: any, solicitud_id: any) {
    const url = `${url_servicios}/solicitudes/editar/${solicitud_id}`;
    return this.http.put(url, data, this.headers);
  }

  updateStatus(data: any, solicitud_id: any) {
    const url = `${url_servicios}/solicitudes/update-status/${solicitud_id}`;
    return this.http.put(url, data, this.headers);
  }
  deleteSolicitud(solicitud_id: string) {
    const url = `${url_servicios}/solicitudes/remove/${solicitud_id}`;
    return this.http.delete(url, this.headers);
  }
}
