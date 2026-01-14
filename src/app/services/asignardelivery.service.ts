import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Blog } from '../models/blog.model';
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


  getBlogs(){

    const url = `${base_url}/asignardelivery`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp:{ok: boolean, asignacions: Asignacion}) => resp.asignacions)
      )

  }


  getBlogById(_id: string){
    const url = `${base_url}/asignardelivery/${_id}`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp:{ok: boolean, asignacion: Asignacion}) => resp.asignacion)
        );

  }
  getBlogByUserId(_id: string){
    const url = `${base_url}/asignardelivery/user/${_id}`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp:{ok: boolean, asignacion: Asignacion}) => resp.asignacion)
        );

  }


  crearBlog(asignacion: Asignacion){
    const url = `${base_url}/asignardelivery/store`;
    return this.http.post(url, asignacion, this.headers);
  }

  actualizarBlog(asignacion: Asignacion){
    const url = `${base_url}/asignardelivery/update/${asignacion._id}`;
    return this.http.put(url, asignacion, this.headers);
  }

  borrarBlog(_id:string){
    const url = `${base_url}/asignardelivery/remove/${_id}`;
    return this.http.delete(url, this.headers);
  }


}
