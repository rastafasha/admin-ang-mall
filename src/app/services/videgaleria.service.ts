import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {environment} from 'src/environments/environment';
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { Videogaleria } from "../models/videogaleria.model";

const base_url = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class VideogaleriaService {

  videocursos: Videogaleria

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

  getVideos(){
    const url = `${base_url}/videocursos`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp:{ok: boolean, videocursos: Videogaleria[]}) => resp.videocursos)
      )
    }

  get_video(_id: string){
    const url = `${base_url}/videocursos/${_id}`;
    return this.http.get<any>(url, this.headers)
    .pipe(
      map((resp:{ok: boolean, videocurso: Videogaleria}) => resp.videocurso)
      );
  }

  find_by_curso(_id:string):Observable<any>{
    const url = `${base_url}/videocursos/bycurso/${_id}`;
    return this.http.get(url, this.headers);
  }


  create(data:any){
    const url = `${base_url}/videocursos/crear`;
    return this.http.post(url, data, this.headers);
  }

  actualizarVideo(videogaleria:Videogaleria){
    const url = `${base_url}/videocursos/update/${videogaleria._id}`;
    return this.http.put(url, videogaleria, this.headers);

  }


  eliminar(_id:string){
    const url = `${base_url}/videocursos/borrar/${_id}`;
    return this.http.delete(url, this.headers);
  }

  desactivar(id:string):Observable<any>{
    const url = `${base_url}/videocursos/desactivar/`+id;
    return this.http.get(url,  this.headers);
  }

  activar(id:string):Observable<any>{
    const url = `${base_url}/videocursos/activar/`+id;
    return this.http.get(url,  this.headers);
  }
}
