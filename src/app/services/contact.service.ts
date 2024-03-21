import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {environment} from 'src/environments/environment';
import { CargarContacto } from '../auth/interfaces/cargar-mensajes.interface';
import { Contacto } from '../models/contacto.model';
import { map } from 'rxjs/operators';
const base_url = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class ContactoService {

  public url:string;

  constructor(
    private http : HttpClient,
  ) {

   }

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

   listar():Observable<any>{
    const url = `${base_url}/contactos`;
    return this.http.get(url, this.headers);
  }

   registro(data:any):Observable<any>{
    const url = `${base_url}/contactos`;
    return this.http.post(url, data, this.headers);
  }

  borrarMessage(_id:string){
    const url = `${base_url}/contactos/${_id}`;
    return this.http.delete(url, this.headers);
  }

  getMessage(_id:string){
    const url = `${base_url}/contactos/${_id}`;
    return this.http.get(url, this.headers);
  }


  cargarMensajes(desde: number = 0){

    const url = `${base_url}/contactos?desde=${desde}`;
    return this.http.get<CargarContacto>(url, this.headers)
      .pipe(
        map( resp =>{
          const contactos = resp.contactos.map(
            contacto => new Contacto(
              contacto.nombres,
              contacto.mensaje,
              contacto.tema,
              contacto.correo,
              contacto.telefono,
              contacto._id,
              ));

          return {
            total: resp.total,
            contactos

          }
        })
      )
  }

  desactivar(id:string):Observable<any>{
    const url = `${base_url}/contactos/contacto_admin/admin/desactivar/`+id;
    return this.http.get(url,  this.headers);
  }

  atender(id:string):Observable<any>{
    const url = `${base_url}/contactos/contacto_admin/admin/atendido/`+id;
    return this.http.get(url,  this.headers);
  }

  getPendientes():Observable<any>{
    const url = `${base_url}/contactos/pendientes`;
    return this.http.get(url, this.headers);
  }
  getAtendidos():Observable<any>{
    const url = `${base_url}/contactos/pendientes`;
    return this.http.get(url, this.headers);
  }

}
