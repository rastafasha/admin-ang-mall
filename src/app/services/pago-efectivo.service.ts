import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map, Observable } from 'rxjs';
import { PagoEfectivo } from '../models/pagoEfectivo.model';

const base_url = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class PagoEfectivoService {

  public url;
  
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


  registro(data:any){
    return this.http.post<any>(`${this.url}/pagoefectivo/store`,data);
  }

  listar(){
    // return this._http.get<any>(`${this.url}/pagoefectivo`);
    const url = `${base_url}/pagoefectivo`;
        return this.http.get<any>(url, this.headers)
          .pipe(
            map((resp:{ok: boolean, pagoefectivos: PagoEfectivo[]}) => resp.pagoefectivos)
          )
  }
}
