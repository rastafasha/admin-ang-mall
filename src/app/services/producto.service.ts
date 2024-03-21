import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Producto } from '../models/producto.model';
import { Observable } from "rxjs";

const base_url = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  public producto: Producto;


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


  cargarProductos(){

    const url = `${base_url}/productos`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp:{ok: boolean, productos: Producto[]}) => resp.productos)
      )

  }


  getProductoById(_id: string){
    const url = `${base_url}/productos/${_id}`;
    return this.http.get<any>(url, this.headers)
      .pipe(
        map((resp:{ok: boolean, producto: Producto}) => resp.producto)
        );

  }


  crearProducto(producto: {
    titulo: string,
    precio_antes: string,
    info_short: string,
    detalle: string,
    stock: string,
    categoria: string,
    subcategoria: string,
    nombre_selector: string,
    marca: string,
    video_review: string,
    precio_ahora: string,
    isFeatured: boolean,
  }){
    const url = `${base_url}/productos/store`;
    return this.http.post(url, producto, this.headers);
  }

  actualizarProducto(producto: any):Observable<any>{
    const url = `${base_url}/productos/update/${producto._id}`;
    return this.http.put(url, producto, this.headers);
  }
  // actualizarProducto(id:string):Observable<any>{
  //   const url = `${base_url}/productos/`+id;
  //   return this.http.get(url,  this.headers);
  // }


  borrarProducto(_id:string){
    const url = `${base_url}/productos/${_id}`;
    return this.http.delete(url, this.headers);
  }

  best_seller():Observable<any>{
    const url = `${base_url}/productos/productos_ventas/best_sellers`;
    return this.http.get(url, this.headers);
  }

  populares():Observable<any>{
    const url = `${base_url}/productos//productos_ventas/populares`;
    return this.http.get(url, this.headers);
  }

  listar_admin(filtro:any):Observable<any>{
    const url = `${base_url}/productos/admin/`+filtro;
    return this.http.get(url,  this.headers);
  }

  listar_prices(filtro:any,min:any,max:any,subcategoria:any,cat:any,sort:any,marca:any):Observable<any>{
    const url = `${base_url}/productos/`+filtro+'/'+min+'/'+max+'/'+subcategoria+'/'+cat+'/'+sort+'/'+marca;
    return this.http.get(url,  this.headers);
  }

  cat_by_name(nombre:any):Observable<any>{
    const url = `${base_url}/productos/categoria/name/`+nombre;
    return this.http.get(url,  this.headers);
  }

  listar_papelera(filtro:any):Observable<any>{
    const url = `${base_url}/productos/productos/papelera/`+filtro;
    return this.http.get(url,  this.headers);
  }

  listar_cat(filtro:any):Observable<any>{
    const url = `${base_url}/productos/producto_admin_cat/cat/`+filtro;
    return this.http.get(url,  this.headers);
  }

  listar_autocomplete():Observable<any>{
    const url = `${base_url}/productos/producto_cliente_autocomplete`;
    return this.http.get(url,  this.headers);
  }

  listar_general_data(filtro:any):Observable<any>{
    const url = `${base_url}/productos/producto_general/general/data/`+filtro;
    return this.http.get(url,  this.headers);
  }

  find_by_slug(slug:any):Observable<any>{
    const url = `${base_url}/productos/producto_by_slug/slug/`+slug;
    return this.http.get(url,  this.headers);
  }

  listar_cat_papelera(filtro:any):Observable<any>{
    const url = `${base_url}/productos/productos/cat/papelera/`+filtro;
    return this.http.get(url,  this.headers);
  }

  list_one(id:string):Observable<any>{
    const url = `${base_url}/productos/producto_admin_editar/one/`+id;
    return this.http.get(url,  this.headers);
  }

  listar_newest():Observable<any>{
    const url = `${base_url}/productos/productos_nuevos/show_producto`;
    return this.http.get(url,  this.headers);
  }

  reducir_stock(id:string,cantidad:any):Observable<any>{
    const url = `${base_url}/productos/productos_stock/reducir/`+id+'/'+cantidad;
    return this.http.get(url,  this.headers);
  }

  aumentar_stock(id:string,cantidad:any):Observable<any>{
    const url = `${base_url}/productos/productos_stock/aumentar/`+id+'/'+cantidad;
    return this.http.get(url,  this.headers);
  }

  desactivar(id:string):Observable<any>{
    const url = `${base_url}/productos/producto_admin/admin/desactivar/`+id;
    return this.http.get(url,  this.headers);
  }

  activar(id:string):Observable<any>{
    const url = `${base_url}/productos/producto_admin/admin/activar/`+id;
    return this.http.get(url,  this.headers);
  }

  papelera(_id:string){
    const url = `${base_url}/productos/producto_admin/admin/papelera/${_id}`;
    return this.http.get(url,  this.headers);
  }

  aumentar_ventas(id:string):Observable<any>{
    const url = `${base_url}/productos/productos_ventas/aumentar/`+id;
    return this.http.get(url,  this.headers);
  }




}
