import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Blog } from '../models/blog.model';
import { Observable } from "rxjs";

const base_url = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class BlogService {


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


  getBlogs(){

    const url = `${base_url}/blogs`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp:{ok: boolean, blogs: Blog}) => resp.blogs)
      )

  }


  getBlogById(_id: string){
    const url = `${base_url}/blogs/${_id}`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp:{ok: boolean, blog: Blog}) => resp.blog)
        );

  }


  crearBlog(blog: Blog){
    const url = `${base_url}/blogs`;
    return this.http.post(url, blog, this.headers);
  }

  actualizarBlog(blog: Blog){
    const url = `${base_url}/blogs/${blog._id}`;
    return this.http.put(url, blog, this.headers);
  }

  borrarBlog(_id:string){
    const url = `${base_url}/blogs/${_id}`;
    return this.http.delete(url, this.headers);
  }

  desactivar(id:string):Observable<any>{
    const url = `${base_url}/blogs/blog_admin/admin/desactivar/`+id;
    return this.http.get(url,  this.headers);
  }

  activar(id:string):Observable<any>{
    const url = `${base_url}/blogs/blog_admin/admin/activar/`+id;
    return this.http.get(url,  this.headers);
  }




}
