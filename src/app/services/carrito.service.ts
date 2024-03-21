import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {environment} from 'src/environments/environment';
import { Carrito } from "../models/carrito.model";

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  public url;

  constructor(
    private _http : HttpClient,
  ) {
    this.url = environment.baseUrl;
   }

  registro(data:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.post(this.url + '/carrito/registro',data,{headers:headers})
  }

  preview_carrito(id:string):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url + '/carrito/limit/data/'+id,{headers:headers})
  }

  remove_carrito(id:string):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.delete(this.url + '/carrito/delete/'+id,{headers:headers})
  }
}
