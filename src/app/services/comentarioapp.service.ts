import { Injectable } from '@angular/core';
import { ComentarioApp } from '../models/comentarioapp.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs';
const base_url = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class ComentarioappService {

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

  getAll() {
    const url = `${base_url}/comentariosapp`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp: { ok: boolean, comentarios: ComentarioApp[] }) => resp.comentarios)
      )
  }
  create(data: any) {
    const url = `${base_url}/comentariosapp/store`;
    return this.http.post(url, data, this.headers);
  }

  getByTiendaId(tiendId: string) {
    const url = `${base_url}/comentariosapp/tienda/${tiendId}`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp: { ok: boolean, comentarios: ComentarioApp }) => resp.comentarios)
      );

  }

  borrar(_id:string){
      const url = `${base_url}/comentariosapp/remove/${_id}`;
      return this.http.delete(url, this.headers);
    }


}
