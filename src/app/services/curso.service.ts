import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Curso } from '../models/curso.model';
import { Observable } from "rxjs";

const base_url = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class CursoService {

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


  getCursos(){

    const url = `${base_url}/cursos`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp:{ok: boolean, cursos: Curso[]}) => resp.cursos)
      )

  }


  getCursoById(_id: string){
    const url = `${base_url}/cursos/${_id}`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp:{ok: boolean, curso: Curso}) => resp.curso)
        );

  }


  crearCurso(curso: Curso){
    const url = `${base_url}/cursos`;
    return this.http.post(url, curso, this.headers);
  }

  actualizarCurso( curso: Curso){
    const url = `${base_url}/cursos/${curso._id}`;
    return this.http.put(url, curso, this.headers);
  }

  borrarCurso(_id:string){
    const url = `${base_url}/cursos/${_id}`;
    return this.http.delete(url, this.headers);
  }


  desactivar(id:string):Observable<any>{
    const url = `${base_url}/cursos/curso_admin/admin/desactivar/`+id;
    return this.http.get(url,  this.headers);
  }

  activar(id:string):Observable<any>{
    const url = `${base_url}/cursos/curso_admin/admin/activar/`+id;
    return this.http.get(url,  this.headers);
  }






}
