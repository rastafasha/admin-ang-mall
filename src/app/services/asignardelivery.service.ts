import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Asignacion } from '../models/asignaciondelivery.model';
const base_url = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class AsignardeliveryService {

  constructor(
    private http: HttpClient
  ) { }

  get token():string{
    return localStorage.getItem('token') || '';
  }


  get headers(){
    return{
      headers: {
        'x-token': this.token
      }
    }
  }


    gets(){
  
      const url = `${base_url}/asignardelivery`;
      return this.http.get<any>(url, this.headers)
        .pipe(
          map((resp:{ok: boolean, asignacions: Asignacion}) => resp.asignacions)
        )
  
    }
  
  
    getById(_id: string){
      const url = `${base_url}/asignardelivery/${_id}`;
      return this.http.get<any>(url, this.headers)
        .pipe(
          map((resp:{ok: boolean, asignacion: Asignacion}) => resp.asignacion)
          );
  
    }
    getByUserId(_id: string){
      const url = `${base_url}/asignardelivery/user/${_id}`;
      return this.http.get<any>(url, this.headers)
        .pipe(
          map((resp:{ok: boolean, asignacion: Asignacion}) => resp.asignacion)
          );
  
    }
    getByTiendaId(tiendId: string){
      const url = `${base_url}/asignardelivery/tienda/${tiendId}`;
      return this.http.get<any>(url, this.headers)
        .pipe(
          map((resp:{ok: boolean, asignacions: Asignacion}) => resp.asignacions)
          );
  
    }
  
  
    create(asignacion: any){
      const url = `${base_url}/asignardelivery/store`;
      return this.http.post(url, asignacion, this.headers);
    }
  
    actualizar(asignacion: Asignacion){
      const url = `${base_url}/asignardelivery/update/${asignacion._id}`;
      return this.http.put(url, asignacion, this.headers);
    }
  
    borrar(_id:string){
      const url = `${base_url}/asignardelivery/remove/${_id}`;
      return this.http.delete(url, this.headers);
    }


}
