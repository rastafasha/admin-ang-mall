import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {environment} from 'src/environments/environment';

const base_url = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  public url;

  constructor(
    private _http : HttpClient
  )
  {
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
    console.log(data);

    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.post(this.url + '/tickets/',data,{headers:headers})
  }

  send(data:any):Observable<any>{
    console.log(data);
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.post(this.url + '/tickets/ticket_msm/send',data,{headers:headers})
  }

  listar(id:string):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url + '/tickets/'+id,{headers:headers})


  }

  data(de:any,para:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url + '/tickets/ticket_chat/chat/'+de+'/'+para,{headers:headers})
  }

  get_ticket(id:string):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url + '/tickets/'+id,{headers:headers})
  }
  get_ticketmensajes(id:string):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url + '/tickets/ticket_listar/listar/'+id,{headers:headers})
  }

  delete(id:string):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.delete(this.url + '/tickets/delete/'+id,{headers:headers})
  }

  get_tickets_admin(){

    const url = `${base_url}/tickets`;
    return this._http.get(url, this.headers)

  }
}
