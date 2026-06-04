import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Categoria } from '../models/categoria.model';
import { Reservacion } from '../models/reservacion.model';
const base_url = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class ReservacionService {


  constructor(
    private http: HttpClient
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


  getReservaciones() {

    const url = `${base_url}/reservacion`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp: { ok: boolean, reservaciones: Reservacion[] }) => resp.reservaciones)
      )
  }

  getReservacionById(_id: string) {
    const url = `${base_url}/reservacion/${_id}`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp: { ok: boolean, reservacion: Reservacion }) => resp.reservacion)
      );
  }

  getReservacionByLocal(_id: any) {
    const url = `${base_url}/reservacion/local/${_id}`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp: { ok: boolean, reservaciones: Reservacion[] }) => resp.reservaciones)
      );
  }

  getReservacionByUser(_id: any) {
    const url = `${base_url}/reservacion/by_user/${_id}`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp: { ok: boolean, reservaciones: Reservacion[] }) => resp.reservaciones)
      );
  }

  crearReservacion(reservacion: Reservacion) {
    const url = `${base_url}/reservacion/store`;
    return this.http.post(url, reservacion, this.headers);
  }

  actualizarReservacion(reservacion: any) {
    const url = `${base_url}/reservacion/update/${reservacion._id}`;
    return this.http.put(url, reservacion, this.headers);
  }

  borrarReservacion(_id: string) {
    const url = `${base_url}/reservacion/delete/${_id}`;
    return this.http.delete(url, this.headers);
  }



}
