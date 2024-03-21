import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {environment} from 'src/environments/environment';
import { Galeria } from "../models/galeria.model";
import { map } from 'rxjs/operators';

const base_url = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class GaleriaService {



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


  find_by_product(id:string):Observable<any>{
    const url = `${base_url}/galerias/galeria_producto/find/${id}`;
    return this.http.get(url, this.headers);
  }


  registro(data:any):Observable<any>{
    const url = `${base_url}/galerias/galeria/registro`;
    return this.http.post(url, data, this.headers);
  }



  listar():Observable<any>{
    const url = `${base_url}/galerias`;
    return this.http.get(url, this.headers);
    }

  get_cupon(id:string):Observable<any>{
    const url = `${base_url}/galerias/${id}`;
    return this.http.get<any>(url, this.headers)
    .pipe(
      map((resp:{ok: boolean, galeria: Galeria}) => resp.galeria)
      );
  }

  eliminar(_id:string):Observable<any>{
    const url = `${base_url}/galerias/${_id}`;
    return this.http.delete(url, this.headers);
  }
}
