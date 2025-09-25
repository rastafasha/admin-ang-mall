import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment';

import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { Marca } from '../models/marca.model';
import { Producto } from '../models/producto.model';
import { Blog } from '../models/blog.model';
import { Page } from '../models/page.model';
import { Curso } from '../models/curso.model';
import { Slider } from '../models/slider.model';
import { Tienda } from '../models/tienda.model';
import { Transferencia } from '../models/transferencia';
import { PagoCheque } from '../models/pagoCheque.model';
import { PagoEfectivo } from '../models/pagoEfectivo.model';
import { Categoria } from '../models/categoria.model';
import { Promocion } from '../models/promocion.model';

const base_url = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

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

  private trasnformarUsuarios(resultados: any[]): Usuario[]{
    return resultados.map(
      user => new Usuario( user.first_name, user.last_name,user.telefono, user.pais, user.numdoc, user.email, '', user.img, user.google, user.role, user.uid)
    )
  }

  private trasnformarProductos(resultados: any[]): Producto[]{
    return resultados;
  }
  private trasnformarMarcas(resultados: any[]): Marca[]{
    return resultados;
  }
  private trasnformarBlogs(resultados: any[]): Blog[]{
    return resultados;
  }
  private trasnformarPages(resultados: any[]): Page[]{
    return resultados;
  }
  private trasnformarCursos(resultados: any[]): Curso[]{
    return resultados;
  }
  private trasnformarSliders(resultados: any[]): Slider[]{
    return resultados;
  }
  private trasnformarTiendas(resultados: any[]): Tienda[]{
    return resultados;
  }
  private trasnformarTrasnferencias(resultados: any[]): Transferencia[]{
    return resultados;
  }
  private trasnformarPagoCheque(resultados: any[]): PagoCheque[]{
    return resultados;
  }
  private trasnformarPagoEfectivo(resultados: any[]): PagoEfectivo[]{
    return resultados;
  }
  private trasnformarCategoria(resultados: any[]): Categoria[]{
    return resultados;
  }
  private trasnformarPromocion(resultados: any[]): Promocion[]{
    return resultados;
  }


  buscar(tipo: 'usuarios'|'categorias' |'marcas' |'productos'|'blogs'|
    'pages'|'sliders'|'cursos'
    | 'tiendas'| 'trasnferencias'
    | 'pagoecheques'| 'pagoefectivos'|'promocions'
    ,
        termino: string
        ){
    const url = `${base_url}/todo/coleccion/${tipo}/${termino}`;
    return this.http.get<any[]>(url, this.headers)
      .pipe(
        map( (resp: any) => {
          switch(tipo) {
              case 'usuarios':
                return this.trasnformarUsuarios(resp.resultados)

              case 'productos':
                return this.trasnformarProductos(resp.resultados)

              case 'marcas':
                return this.trasnformarMarcas(resp.resultados)

                case 'blogs':
                return this.trasnformarBlogs(resp.resultados)

                case 'pages':
                return this.trasnformarPages(resp.resultados)

                case 'cursos':
                return this.trasnformarCursos(resp.resultados)

                case 'tiendas':
                return this.trasnformarTiendas(resp.resultados)

                case 'sliders':
                return this.trasnformarSliders(resp.resultados)

                case 'trasnferencias':
                return this.trasnformarTrasnferencias(resp.resultados)

                case 'pagoecheques':
                return this.trasnformarPagoCheque(resp.resultados)

                case 'pagoefectivos':
                return this.trasnformarPagoEfectivo(resp.resultados)

                case 'categorias':
                return this.trasnformarCategoria(resp.resultados)
                
                case 'promocions':
                return this.trasnformarPromocion(resp.resultados)


              default:
                return[];
          }
        })
      )
  }
  


  searchGlobal(termino: string){
    const url = `${base_url}/todo/${termino}`;
    return this.http.get<any[]>(url, this.headers)
  }
}
