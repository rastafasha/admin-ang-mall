import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { delay } from 'rxjs/operators';

import { BusquedasService } from '../../../services/busquedas.service';
import { Categoria } from '../../../models/categoria.model';
import { CategoriaService } from '../../../services/categoria.service';
import { Producto } from '../../../models/producto.model';
import { ProductoService } from '../../../services/producto.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { environment } from 'src/environments/environment';

declare var jQuery:any;
declare var $:any;
@Component({
  selector: 'app-prod-index',
  templateUrl: './prod-index.component.html',
  styleUrls: ['./prod-index.component.css']
})
export class ProdIndexComponent implements OnInit {

  public productos: Producto[] =[];
  public categorias: Categoria[] =[];
  public cargando: boolean = true;
  public url;
  public totalProductos: number = 0;
  public desde: number = 0;

  p: number = 1;
  count: number = 8;

  public imgSubs: Subscription;
  listIcons;

  public msm_error;

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private modalImagenService: ModalImagenService,
    private busquedaService: BusquedasService,
  ) {
    this.url = environment.baseUrl;
   }

  ngOnInit(): void {

    this.loadCategorias();
    this.loadProductos();
    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe(
      delay(100)
    )
    .subscribe(img => { this.loadProductos();});
  }

  ngOnDestroy(){
    this.imgSubs.unsubscribe();
  }

  loadProductos(){
    this.cargando = true;
    this.productoService.cargarProductos().subscribe(
      productos => {
        this.cargando = false;
        this.productos = productos;
        console.log(this.productos);
      }
    )

  }
  loadCategorias(){
    this.cargando = true;
    this.categoriaService.cargarCategorias().subscribe(
      categorias => {
        this.categorias = categorias;
      }
    )

  }

  cambiarPagina(valor: number){
    this.desde += valor;

    if(this.desde < 0){
      this.desde = 0
    }else if( this.desde > this.totalProductos){
      this.desde -= valor;
    }

    this.loadCategorias();


  }




  eliminarProducto(producto: Producto){
    this.productoService.borrarProducto(producto._id)
    .subscribe( resp => {
      this.loadProductos();
      Swal.fire('Borrado', producto.titulo, 'success')
    })

  }

  buscar(termino: string){

    if(termino.length === 0){
      return this.loadCategorias();
    }

    this.busquedaService.buscar('productos', termino)
    .subscribe( resultados => {
      resultados;
    })
  }




  desactivar(id){
    this.productoService.desactivar(id).subscribe(
      response=>{
        $('#desactivar-'+id).modal('hide');
        $('.modal-backdrop').removeClass('show');
        this.loadProductos();
      },
      error=>{
        this.msm_error = 'No se pudo desactivar el producto, vuelva a intenter.'
      }
    )
  }

  activar(id){
    this.productoService.activar(id).subscribe(
      response=>{

        $('#activar-'+id).modal('hide');
        $('.modal-backdrop').removeClass('show');
        this.loadProductos();
      },
      error=>{


        this.msm_error = 'No se pudo activar el producto, vuelva a intenter.'
      }
    )
  }

  papelera(id){
    this.productoService.papelera(id).subscribe(
      response=>{
        $('#papelera-'+id).modal('hide');
        $('.modal-backdrop').removeClass('show');
        this.loadProductos();

      },
      error=>{
        this.msm_error = 'No se pudo mover a papelera el producto, vuelva a intenter.'
      }
    )
  }



}
