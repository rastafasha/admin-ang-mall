import { Injectable } from '@angular/core';
import {environment} from 'src/environments/environment';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import{Usuario} from '../models/usuario.model';
import{Producto} from '../models/producto.model';
@Injectable({
  providedIn: 'root'
})
export class VentaService {

  public url;
  rapidapiK = environment.rapidapiKey;
  rapidapiH = environment.rapidapiHost;
  clientIdPaypal = environment.clientIdPaypal;
  sandboxPaypal = environment.sandboxPaypal;

  user:Usuario;
  producto:Producto;

  constructor(
    private _http : HttpClient
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
    let headers = new HttpHeaders().set('Content-Type','application/json');
    // return this._http.post(this.url+'/ventas/venta/registro',data,{headers:headers});
    return this._http.post(this.url+'/ventas/store',data,{headers:headers});
  }

  listar(id:string):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url+'/ventas/'+id,{headers:headers});
  }

  listarporUser(id:string):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url+'/ventas/user_order/'+id,{headers:headers});
  }


  detalle(id:string):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url+'/ventas/venta_track/detalle/'+id,{headers:headers});
  }

  finalizar(id:string):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url+'/ventas/venta_finalizar/venta/'+id,{headers:headers});
  }

  update_envio(id:string):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url+'/ventas/venta_enviado/update/'+id,{headers:headers});
  }

  listarCancelacionporUser(id:string):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url+'/ventas/user_cancelacion/'+id,{headers:headers});
  }

  evaluar_cancelacion(id:string):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url+'/ventas/cancelacion_evaluar/venta/'+id,{headers:headers});
  }

  reembolsar(id:string,idticket:string):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url+'/ventas/cancelacion_send/reembolsar/'+id+'/'+idticket,{headers:headers});
  }


  cancelar(data:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.post(this.url+'/ventas/cancelacion_send/cancelar',data,{headers:headers});
  }

  denegar(id:string,idticket:string):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url+'/ventas/cancelacion_send/denegar/'+id+'/'+idticket,{headers:headers});
  }

  listar_cancelacion(wr:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url+'/ventas/get_cancelacion_admin/data/'+wr,{headers:headers});
  }

  get_cancelacion(id:string):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url+'/ventas/get_one_cancelacion_admin/one/'+id,{headers:headers});
  }

  get_token():Observable<any>{
    let headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type':'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(`${this.clientIdPaypal}:${this.sandboxPaypal}`),
      // 'Authorization': 'Basic ' + btoa('AVTHn-IitbqsInQ7Y_Ald2kPSvEjTd3RRm_OevRxyzv_tXo7XskvFK6w2IxFuZLeKSXWUqoDg_JdWu5V:AXlazeNsZ0CmjfJIronSzcqzw4hLHkcoVEM5fO5BY7AbD-_GhKoKezRcavq6-T4kQuRqaTXFB_VXmheG'),
    });
    return this._http.post('https://api.sandbox.paypal.com/v1/oauth2/token','grant_type=client_credentials',{headers:headers});
  }

  set_reembolso(token:string,id:string):Observable<any>{
    let headers = new HttpHeaders({
      'Content-Type':'application/json',
      'Authorization': 'Bearer ' + token,
    });
    return this._http.post('https://api.sandbox.paypal.com/v1/payments/capture/'+id+'/refund',{},{headers:headers});
  }

  

  get_cancelacion_venta(id:string):Observable<any>{

    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url+'/ventas/cancelacion_venta/obtener_data/'+id,{headers:headers});
  }

  evaluar_venta_user(user:any,producto:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url+'/ventas/evaluar_venta/data/'+user+'/'+producto,{headers:headers});
  }

  get_data_venta_admin(search:any,orden:any,tipo:any):Observable<any>{

    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url+'/ventas/venta_admin/listar/'+search+'/'+orden+'/'+tipo,{headers:headers});
  }

  get_data_dashboard():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url+'/ventas/venta_data/dashboard',{headers:headers});
  }

  get_detalle_hoy():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url+'/ventas/venta_data/detalles/hoy',{headers:headers});
  }

  init_data_admin():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url+'/ventas/venta_admin_init/init_data',{headers:headers});
  }

  //tracking

  set_track(id:string,data:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.post(this.url+'/ventas/venta_track/set/'+id,data,{headers:headers});
  }

  track(number:any){
    let headers = new HttpHeaders()
    .set('x-rapidapi-host', this.rapidapiH)
    .set("x-rapidapi-key", this.rapidapiK)
    .set("useQueryString", "true");
    return this._http.get('https://apidojo-17track-v1.p.rapidapi.com/track?timeZoneOffset=0&codes='+number,{headers:headers});
  }

  enviarFacturaCliente(pdf:any, venta:any){
    // Convertir el PDF a Blob
    const pdfBlob = pdf.output('blob');

    const formData = new FormData();
    formData.append('facturacliente', pdfBlob, `${venta._id}.pdf`);
    formData.append('nombrecliente',venta.user.first_name + ' ' + venta.user.last_name);
    formData.append('emailcliente',venta.user.email);
    formData.append('monto',venta.total_pagado);

    return this._http.post<any>(`${this.url}/ventas/enviar_factura`,formData);
  }
}
