import { Component, Input, OnInit } from '@angular/core';
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
import { MessageService } from 'src/app/services/message.service';
import { CartItemModel } from 'src/app/models/cart-item-model';

declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-atencion-local',
  templateUrl: './atencion-local.component.html',
  styleUrls: ['./atencion-local.component.css']
})
export class AtencionLocalComponent implements OnInit {

  @Input() cartItem: CartItemModel;
  cartItems: any[] = [];

  public cantidad_to_cart = 1;
  public precio_to_cart;
  public selector_to_cart = ' ';
  public err_stock ='';
  public selector_error = false;
  public producto: Producto;

  
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

  public msm_error = false;
  public msm_success = false;


  public productoSeleccionado: Producto;

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private modalImagenService: ModalImagenService,
    private busquedaService: BusquedasService,
    private messageService: MessageService,
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



  addToCart(prod:any): void{
    this.productoSeleccionado = prod;
    this.messageService.sendMessage(this.productoSeleccionado);
    console.log('sending item to cart...', this.productoSeleccionado);
    this.msm_success = true;
    setTimeout(()=>{
      this.close_alert()
    },2500);
    this.ngOnInit();
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




  close_alert(){
    this.msm_error = false;
    this.msm_success = false;
  }

  close_toast(){
    $('#dark-toast').removeClass('show');
        $('#dark-toast').addClass('hide');
  }

}
