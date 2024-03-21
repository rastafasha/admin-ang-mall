import { Component, OnInit } from '@angular/core';
import { ProductoService } from "../../../services/producto.service";
import {environment} from 'src/environments/environment';
import { CategoriaService } from "../../../services/categoria.service";
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../../services/usuario.service';

declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-papelera',
  templateUrl: './papelera.component.html',
  styleUrls: ['./papelera.component.css']
})
export class PapeleraComponent implements OnInit {

  public productos;
  public count_cat;
  public filtro;
  public url;
  public categorias;
  public search_categoria = '';
  public msm_error;
  public identity;

  listCategorias;

  p: number = 1;
  count: number = 8;

  constructor(
    private usuarioService: UsuarioService,
    private _router : Router,
    private _route :ActivatedRoute,
    private _productoService : ProductoService,
    private categoriaService : CategoriaService,
  ) {
    this.identity = this.usuarioService.usuario;
  }

  ngOnInit(): void {
    this.resetSearch();
    this.getCategorias();

  }

  getCategorias(){
    this.categoriaService.cargarCategorias().subscribe(
      resp =>{
        this.listCategorias = resp;
        console.log(this.listCategorias)

      }
    )
  }

  resetSearch(){
    this.filtro = ''
    this._productoService.listar_papelera('').subscribe(
      response=>{
        this.productos = response.productos;
        this.count_cat = this.productos.length;
        this.search_categoria = '';
        console.log(this.productos);

      },
      error =>{

      }
    );
  }



  search(searchForm){
    console.log(this.filtro);
    this._productoService.listar_papelera(this.filtro).subscribe(
      response=>{
        this.productos = response.productos;
        this.count_cat = this.productos.length;

      },
      error =>{

      }
    );
  }

  search_cat(){
    this._productoService.listar_cat_papelera(this.search_categoria).subscribe(
      response=>{
        this.productos = response.productos;
        this.count_cat = this.productos.length;
        this.filtro = '';
      },
      error =>{

      }
    );
  }

  desactivar(id){
    this._productoService.desactivar(id).subscribe(
      response=>{
        $('#mover-'+id).modal('hide');
        $('.modal-backdrop').removeClass('show');
        this.resetSearch();
      },
      error=>{
        this.msm_error = 'No se pudo activar el producto, vuelva a intenter.'
      }
    )
  }

  close_toast(){
    /* $('#dark-toast').removeClass('show');
        $('#dark-toast').addClass('hide'); */
  }

}
