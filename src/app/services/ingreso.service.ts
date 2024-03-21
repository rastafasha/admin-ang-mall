import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {environment} from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Ingreso } from '../models/ingreso.model';
const base_url = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class IngresoService {

  public url;

  constructor(
    private _http : HttpClient,
  ) {
    this.url = environment.baseUrl;
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
    const fd = new FormData();
    fd.append('user',data.user);
    fd.append('factura',data.factura);
    fd.append('total_pagado',data.total_pagado);
    fd.append('proveedor',data.proveedor);
    fd.append('nota',data.nota);
    fd.append('detalles',data.detalles);
    return this._http.post(this.url + '/ingresos/',fd);
  }

  get_data_venta_admin(search:any,orden:any,tipo:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url+'/ingresos/listar/'+search+'/'+orden+'/'+tipo,{headers:headers});
  }

  get_data_detalle(id:string):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url+'/ingresos/detalle/'+id,{headers:headers});
  }

  init_data():Observable<any>{

    const url = `${base_url}/ingresos`;
    return this._http.get<any>(url, this.headers)
      .pipe(
        map((resp:{ok: boolean, ingresos: Ingreso[]}) => resp.ingresos)
      )
  }
}
