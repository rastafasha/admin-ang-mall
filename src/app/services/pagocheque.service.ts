import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map, Observable } from 'rxjs';
import { PagoCheque } from '../models/pagoCheque.model';

const base_url = environment.baseUrl;
@Injectable({
  providedIn: 'root'
})
export class PagochequeService {

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
      return this.http.post<any>(`${this.url}/pagocheque/store`,data);
    }
  
    listar(){
      // return this._http.get<any>(`${this.url}/pagocheque`);
      const url = `${base_url}/pagocheque`;
              return this.http.get<any>(url, this.headers)
                .pipe(
                  map((resp:{ok: boolean, pagocheques: PagoCheque[]}) => resp.pagocheques)
                )
    }
     updateStatus(trasnferencia:any){
        const url = `${this.url}/pagocheque/statusupdate/${trasnferencia._id}`;
        return this.http.put(url, trasnferencia, this.headers);
      }
}
