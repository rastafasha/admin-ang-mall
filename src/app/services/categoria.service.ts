import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Categoria } from '../models/categoria.model';
import { Observable } from "rxjs";

const base_url = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {


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


  cargarCategorias(){

    const url = `${base_url}/categorias`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp:{ok: boolean, categorias: Categoria[]}) => resp.categorias)
      )

  }


  getCategoriaById(_id: string){
    const url = `${base_url}/categorias/${_id}`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp:{ok: boolean, categoria: Categoria}) => resp.categoria)
        );

  }


  crearCategoria(categoria: {nombre: string, icono: string, img: string, state_banner: string, subcategorias: string}){
    const url = `${base_url}/categorias`;
    return this.http.post(url, categoria, this.headers);
  }

  actualizarCategoria(categoria: Categoria){
    const url = `${base_url}/categorias/${categoria._id}`;
    return this.http.put(url, categoria, this.headers);
  }

  borrarCategoria(_id:string){
    const url = `${base_url}/categorias/${_id}`;
    return this.http.delete(url, this.headers);
  }

  get_car_slide():Observable<any>{
    const url = `${base_url}/categorias/slider`;
    return this.http.get(url, this.headers);
  }

  list_one(id:string):Observable<any>{
    const url = `${base_url}/categorias/one/${id}`;
    return this.http.get(url, this.headers);
  }


  desactivar(id:string):Observable<any>{
    const url = `${base_url}/categorias/admin/desactivar/`+id;
    return this.http.get(url,  this.headers);
  }

  activar(id:string):Observable<any>{
    const url = `${base_url}/categorias/admin/activar/`+id;
    return this.http.get(url,  this.headers);
  }


  getCategoriesActivas() {
    const url = `${base_url}/categorias/cat/activas`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp:{ok: boolean, categorias: Categoria[]}) => resp.categorias)
      )
  }

   find_by_nombre(nombre):Observable<any>{
    const url = `${base_url}/categorias/category_by_nombre/nombre/${nombre}`;
    return this.http.get<any>(url)
    .pipe(
      map((resp:{ok: boolean, categoria: Categoria}) => resp.categoria)
      );
  }


}
