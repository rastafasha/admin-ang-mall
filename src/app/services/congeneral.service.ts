import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Congeneral } from '../models/congeneral.model';
import { Observable } from "rxjs";

const base_url = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class CongeneralService {

  public congeneral: Congeneral;

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


  cargarCongenerals(){

    const url = `${base_url}/congenerals`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp:{ok: boolean, congenerals: Congeneral[]}) => resp.congenerals)
      )

  }


  getCongeneralById(_id: string){
    const url = `${base_url}/congenerals/${_id}`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp:{ok: boolean, congeneral: Congeneral}) => resp.congeneral)
        );


  }


  crearCongeneral(congeneral: Congeneral){
    const url = `${base_url}/congenerals`;
    return this.http.post(url, congeneral, this.headers);
  }

  actualizarCongeneral(congeneral: Congeneral){
    const url = `${base_url}/congenerals/${congeneral._id}`;
    return this.http.put(url, congeneral, this.headers);
  }

  borrarCongeneral(_id:string){
    const url = `${base_url}/congenerals/${_id}`;
    return this.http.delete(url, this.headers);
  }

  get_data():Observable<any>{
    const url = `${base_url}/congenerals/obtener`;
    return this.http.get(url, this.headers);
  }

  get_promocion():Observable<any>{

    const url = `${base_url}/congenerals/promocion/obtener`;
    return this.http.get(url,  this.headers);
  }


  promocion_update(_id:string,data:any):Observable<any>{
    const url = `${base_url}/congenerals/promocion/update/${_id}`;

    const fd = new FormData();
    fd.append('etiqueta',data.etiqueta);
    fd.append('first_title',data.first_title);
    fd.append('producto_title',data.producto_title);
    fd.append('subtitulo',data.subtitulo);
    fd.append('end',data.end);
    fd.append('enlace',data.enlace);
    fd.append('banner',data.banner);
    fd.append('estado',data.estado);
    return this.http.put(url,+data.str_banner,  this.headers);
  }

  get_slider():Observable<any>{

    const url = `${base_url}/congenerals/slider/obtener`;
    return this.http.get(url,  this.headers);
  }

  get_slider_one(id:string):Observable<any>{
    console.log(id);
    const url = `${base_url}/congenerals/slider/one/${id}`;
    return this.http.get(url,  this.headers);
  }

  update_slider(id:string,data:any):Observable<any>{
    const url = `${base_url}/congenerals/slider/update/`;
    const fd = new FormData();
    fd.append('titulo_uno',data.titulo_uno);
    fd.append('titulo_dos',data.titulo_dos);
    fd.append('imagen',data.imagen);
    fd.append('estado',data.estado);
    fd.append('subtitulo',data.subtitulo);
    fd.append('str_banner',data.str_banner);
    return this.http.put(url,+data.str_banner,  this.headers);
  }




}
