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
    // se corrigió la ruta '/carritos'
    return this._http.post(this.url + '/carritos',data,{headers:headers})
  }

  preview_carrito(id:string):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    // se corrigió la ruta '/carrito/limit/data/', lo correcto es '/carritos/limit/data/'
    return this._http.get(this.url + '/carritos/limit/data/'+id,{headers:headers})
  }

  remove_carrito(id:string):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.delete(this.url + '/carritos/delete/'+id,{headers:headers})
  }
}
