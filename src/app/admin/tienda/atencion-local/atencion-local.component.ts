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
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { TiendaService } from 'src/app/services/tienda.service';
import { Tienda } from 'src/app/models/tienda.model';

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
  public tienda: Tienda;
  public usuarioSeleccionado: any;

  public numdoc: any;
  public first_name: any;
  public last_name: any;
  public user: any;
  public local: any;
  public email: any;
  public telefono: any;

  
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
    private userService: UsuarioService,
    private tiendaService: TiendaService,
  ) {
    this.url = environment.baseUrl;
   }

  ngOnInit(): void {
    let USER = localStorage.getItem("user");
    this.user = JSON.parse(USER ? USER: '');
    this.local = this.user.local;

    this.loadCategorias();
    this.loadProductos();
    this.getLocal();
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

  getLocal(){
    this.tiendaService.getTiendaById(this.local).subscribe(tienda=>{
      this.tienda = tienda;
    })
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

  filterClient(){
    this.userService.getClient(this.numdoc+"").subscribe(numdoc=>{
      console.log(numdoc);
      this.usuarioSeleccionado = numdoc;
      if(this.usuarioSeleccionado === 404){
        this.usuarioSeleccionado.first_name= '';
        this.usuarioSeleccionado.last_name= '';
        this.usuarioSeleccionado.email= '';
        this.usuarioSeleccionado.telefono= '';
        this.usuarioSeleccionado.n_doc= 0;
      }else{
        this.first_name= this.usuarioSeleccionado.first_name;
        this.last_name= this.usuarioSeleccionado.last_name;
        this.email= this.usuarioSeleccionado.email;
        this.telefono= this.usuarioSeleccionado.telefono;
        this.numdoc= this.usuarioSeleccionado.n_doc;
      }
    })
  }
  resetClient(){
    this.first_name= '';
        this.last_name= '';
        this.email= '';
        this.telefono= '';
        this.numdoc= '';
  }


  addClient(){

    let data = {
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      numdoc: this.numdoc,
      telefono:this.telefono,
      password:this.telefono,
      local:this.local,
    }


    this.userService.crearCliente(data).subscribe(
      resp =>{
        console.log(resp);
        // Swal.fire('Success', resp, 'error');
        Swal.fire('Agregado', `Cliente agregado correctamente`, 'success');
      },(err) => {
        Swal.fire('Error', err.error.msg, 'error');
      }
    );

    
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
