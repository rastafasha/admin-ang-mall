import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ProductoService } from "../../../services/producto.service";
import { CategoriaService } from "../../../services/categoria.service";
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../../services/usuario.service';
import { FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

declare var jQuery:any;
declare var $:any;

declare var bootstrap: any;

@Component({
  selector: 'app-papelera',
  standalone:false,
  templateUrl: './papelera.component.html',
  styleUrls: ['./papelera.component.css']
})
export class PapeleraComponent implements OnInit, OnChanges {

  @Input() productoSeleccionado;
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
  @Output() refreshProductList: EventEmitter<void> = new EventEmitter<void>();

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
  searchForm:FormGroup;
  pageTitle:string;

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

   ngOnChanges(changes: SimpleChanges): void {

    if (
      changes['productoSeleccionado'] &&
      changes['productoSeleccionado'].currentValue
    ) {
      this.pageTitle = 'Papelera';
      const producto = changes['productoSeleccionado'].currentValue;
      
      this.productoSeleccionado = producto;
      this.pageTitle = 'Papelera';
    } else {
      this.pageTitle = 'Papelera';
    }
  }

  onClose() {
    this.closeModal.emit();
  }

  getCategorias(){
    this.categoriaService.cargarCategorias().subscribe(
      resp =>{
        this.listCategorias = resp;

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
      }
    );
  }



  search(searchForm){
    this._productoService.listar_papelera(this.filtro).subscribe(
      response=>{
        this.productos = response.productos;
        this.count_cat = this.productos.length;
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

 
   desactivar(id) {
      Swal.fire({
        title: 'Estas Seguro?',
        text: 'Al aceptar, estás confirmando que el producto regresará a las entradas en estado <b>DESACTIVADO</b>',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Aceptar!',
      }).then((result) => {
        if (result.isConfirmed) {
          this._productoService.desactivar(id)
            .subscribe(resp => {
              this.resetSearch();
            })
          Swal.fire('Borrado!', 'El Archivo fue borrado.', 'success');
        }
      });
    }

}
