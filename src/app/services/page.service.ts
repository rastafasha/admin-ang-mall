import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Page } from '../models/page.model';
import { Observable } from "rxjs";

const base_url = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class PageService {


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


  getPages(){

    const url = `${base_url}/pages`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp:{ok: boolean, pages: Page}) => resp.pages)
      )

  }


  getPageById(_id: string){
    const url = `${base_url}/pages/${_id}`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp:{ok: boolean, page: Page}) => resp.page)
        );

  }


  crearPage(page: Page){
    const url = `${base_url}/pages/store`;
    return this.http.post(url, page, this.headers);
  }

  actualizarPage(page: Page){
    const url = `${base_url}/pages/${page._id}`;
    return this.http.put(url, page, this.headers);
  }

  borrarPage(_id:string){
    const url = `${base_url}/pages/${_id}`;
    return this.http.delete(url, this.headers);
  }

  desactivar(id:string):Observable<any>{
    const url = `${base_url}/pages/page_admin/admin/desactivar/`+id;
    return this.http.get(url,  this.headers);
  }

  activar(id:string):Observable<any>{
    const url = `${base_url}/pages/page_admin/admin/activar/`+id;
    return this.http.get(url,  this.headers);
  }




}
