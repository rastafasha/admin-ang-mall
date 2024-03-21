import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {environment} from 'src/environments/environment';
import { Cupon } from "../models/cupon.model";

import { map } from 'rxjs/operators';

const base_url = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class CuponService {

  public url:string;

  constructor(
    private http : HttpClient
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

  registro(data:any):Observable<any>{
    const url = `${base_url}/cupons`;
    return this.http.post(url, data, this.headers);
  }

  listar():Observable<any>{
    const url = `${base_url}/cupons`;
    return this.http.get(url, this.headers);
    }

  get_cupon(id:string):Observable<any>{
    const url = `${base_url}/cupons/${id}`;
    return this.http.get<any>(url, this.headers)
    .pipe(
      map((resp:{ok: boolean, cupon: Cupon}) => resp.cupon)
      );
  }

  eliminar(_id:string):Observable<any>{
    const url = `${base_url}/cupons/${_id}`;
    return this.http.delete(url, this.headers);
  }
}
