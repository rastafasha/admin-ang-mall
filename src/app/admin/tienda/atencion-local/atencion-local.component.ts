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
import * as io from "socket.io-client";
import { CarritoService } from 'src/app/services/carrito.service';
import { ColorService } from 'src/app/services/color.service';
import { SelectorService } from 'src/app/services/selector.service';
import { VentaService } from 'src/app/services/venta.service';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';

declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-atencion-local',
  templateUrl: './atencion-local.component.html',
  styleUrls: ['./atencion-local.component.css']
})
export class AtencionLocalComponent implements OnInit {

  public socket = io(environment.soketServer);

  @Input() cartItem: CartItemModel;
  cartItems: any[] = [];

  @Input() clienteSeleccionado: any;

  public cantidad_to_cart = 1;
  public precio_to_cart;
  public err_stock ='';
  public selector_error = false;
  public producto: Producto;
  public tienda: Tienda;
  public tienda_moneda: any;
  // public color_to_cart = '#16537e';

  public numdoc: number;
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

  option_selectedd: number = 1;
  solicitud_selectedd: any = null;

  categories: Categoria[] = [];
  subcategories: any[] = [];
  catName: any;
  activeCategory: any;

  p: number = 1;
  count: number = 8;

  public imgSubs: Subscription;
  listIcons;

  public msm_error_review='';
  public msm_error = false;
  public msm_success_fav = false;
  public msm_success = false;

  public get_state_user_producto_coment = false;


  public productoSeleccionado: Producto;
  public clienteGuardado: Usuario;

  public identity;

  public colores : any = [];
  public color_to_cart = '#16537e';
  public selectores : any = [];
  public selector_to_cart = ' ';

  productNotSelected:boolean = true;

  query:string ='';
            searchForm!:FormGroup;
            currentPage = 1;
            collecion='productos';

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private modalImagenService: ModalImagenService,
    private busquedaService: BusquedasService,
    private messageService: MessageService,
    private userService: UsuarioService,
    private tiendaService: TiendaService,
    private _carritoService: CarritoService,
    private _colorService :ColorService,
    private _selectorService : SelectorService,
    private router:Router,
    private _ventaService: VentaService,
  ) {
    this.url = environment.baseUrl;

    this.identity = userService.usuario;
   }

  ngOnInit(): void {
    // obtenemos el cliente del localstorage
    const cliente = localStorage.getItem('cliente');
     // Si el cliente existe, lo parseamos de JSON a un objeto
    if (cliente) {
        this.clienteSeleccionado = JSON.parse(cliente);
        this.loadClienteenProceso();
    } else {
        this.clienteSeleccionado = null; // O maneja el caso en que no hay cliente
    }

    if(!this.identity){
      this.router.navigate(['/login']);
    }

    this.socket.on('new-stock', function (data) {
      this.init_data();

    }.bind(this));
    

    this.uploads();
    
  }

  ngOnDestroy(){
    this.imgSubs.unsubscribe();
  }

  private uploads(){

    if(!this.identity){
      this.router.navigateByUrl('/login');
    }
    
    
    let USER = localStorage.getItem("user");
    this.user = JSON.parse(USER ? USER: '');
    this.local = this.user.local;


    this.loadCategorias();
    // this.loadProductos();
    this.getLocal();
    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe(
      delay(100)
    )
    .subscribe(img => { this.loadProductos();});
  }

  loadProductos(){
    this.cargando = true;
    this.productoService.cargarProductosActivos().subscribe(
      productos => {
        this.cargando = false;
        this.productos = productos;
      }
    )

  }

  loadClienteenProceso(){
    const cliente = localStorage.getItem('cliente');
    this.clienteSeleccionado = JSON.parse(cliente);
    
    
    if(this.clienteSeleccionado === 404){
      this.clienteSeleccionado.first_name= '';
      this.clienteSeleccionado.last_name= '';
      this.clienteSeleccionado.email= '';
      this.clienteSeleccionado.telefono= '';
      this.clienteSeleccionado.numdoc= 0;
    }else{
      this.first_name= this.clienteSeleccionado.first_name;
      this.last_name= this.clienteSeleccionado.last_name;
      this.email= this.clienteSeleccionado.email;
      this.telefono= this.clienteSeleccionado.telefono;
      this.numdoc= this.clienteSeleccionado.numdoc;
    }
  }

  loadCategorias(){
    this.cargando = true;
    this.categoriaService.cargarCategorias().subscribe(
      categorias => {
        this.categorias = categorias;
        this.cargando = false;
      }
    )
    

  }

  getLocal(){
    this.tiendaService.getTiendaById(this.local).subscribe(tienda=>{
      this.tienda = tienda;
      this.tienda_moneda = tienda.moneda;
      this.activeCategory = tienda.categoria.nombre;
      this.getProductosbByTienda();
      // this.getProductosCatName();
      
    })
  }

 

  // getProductosCatName() {
  //   this.catname = this.tienda?.categoria?.nombre ?? this.activeCategory
  //   this.cargando = true
  //   this.categoryService.find_by_nombre(this.catname).subscribe(
  //     (resp: any) => {
  //       this.products = resp.productos || [];
  //       // console.log(this.products)
  //       this.updateTodo();
  //       this.cargando = false
  //     },
  //     (error) => {
  //       console.error('Error al obtener los productos', error);
  //     }
  //   );
  // }


  getProductosbByTienda(){
    this.cargando = true;
    this.productoService.getProductosTienda(this.tienda._id).subscribe(productos=>{
      this.productos = productos;
      // console.log(this.productos)

      //filtramos los productos donde sea igual a la categoria Panaderia
      const productosfiltrados = this.productos.filter((producto: any) => producto.categoria.nombre === this.tienda.subcategoria);
      //extraemos el campo subcategoria
      const subcategorias = productos.map((producto: any) => producto.subcategoria);
      //eliminamos los duplicados
      const subcategoriasUnicas = [...new Set(subcategorias)];
      //creamos un arreglo de objetos con el nombre de la subcategoria y el arreglo de productos
      const categorias = subcategoriasUnicas.map((subcategoria: any) => ({
        nombre: subcategoria,
        products: productos.filter((product: any) => product.subcategoria === subcategoria),
      }));
      this.subcategories = categorias || [];
      this.cargando = false;
    })
  }

  selectCategory(category: string) {
    // console.log('selectCategory called with:', category);
    this.activeCategory = category;
    this.cargando = true
    this.updateTodo();
    this.cargando = false
  }

  updateTodo() {
    // console.log('updateTodo called. activeCategory:', this.activeCategory, 'products:', this.products, 'subcategories:', this.subcategories);
    this.cargando = true
    if (this.activeCategory === 'all') {
      this.productos = this.productos ? this.productos.slice() : [];
    } else {
      const selectedCategory = this.subcategories ? this.subcategories.find(subcat => subcat.nombre === this.activeCategory) : null;
      this.productos = selectedCategory ? selectedCategory.products : [];
    }
    // console.log('todo updated:', this.todo);
    this.cargando = false
  }


   public PageSize(): void {
    this.query = '';
    this.loadProductos();
    // this.router.navigateByUrl('/productos')
  }

  handleSearchEvent(event: any) {
    if (event.productos) {
      this.productos = event.productos;
    }
  }


  /*
  addToCart(prod:any): void{
    console.log('prod save: ',prod)
    // this.productoSeleccionado = prod;
    let data = {
      user: this.identity.uid,
      producto : prod._id,
      cantidad : this.cantidad_to_cart,
      color : this.color_to_cart,
      selector : this.selector_to_cart,
      precio : prod.precio_ahora
    }
    // this.messageService.sendMessage(this.productoSeleccionado);
    console.log('sending item to cart...', prod);
    
    this._carritoService.registro(prod).subscribe(response => {
      this.socket.emit('save-carrito', {new:true});
    });
    this.msm_success = true;
    setTimeout(()=>{
      this.close_alert()
    },2500);
    this.ngOnInit();
  }
    */


  

  filterClient(){
    // localStorage.removeItem('cliente');
    this.userService.getClient(this.numdoc).subscribe(numdoc=>{
      console.log(numdoc);
      this.clienteSeleccionado = numdoc; // se obtiene el cliente por la cedula para relacionar la compra
      // y se envia como un input a producto y al carrito
      
      if(this.clienteSeleccionado === 404){
        this.clienteSeleccionado.first_name= '';
        this.clienteSeleccionado.last_name= '';
        this.clienteSeleccionado.email= '';
        this.clienteSeleccionado.telefono= '';
        this.clienteSeleccionado.n_doc= 0;
      }else{
        this.first_name= this.clienteSeleccionado.first_name;
        this.last_name= this.clienteSeleccionado.last_name;
        this.email= this.clienteSeleccionado.email;
        this.telefono= this.clienteSeleccionado.telefono;
        this.numdoc= this.clienteSeleccionado.n_doc;
      }
    })
  }

  adjuntarClienteaCompra(){
     // lo salvamos temporalmente en el storage
     localStorage.setItem('cliente', JSON.stringify(this.clienteSeleccionado));
     localStorage.getItem('cliente');
     this.ngOnInit();
      
  }
  resetClient(){
    localStorage.removeItem('cliente');
    this.first_name= '';
        this.last_name= '';
        this.email= '';
        this.telefono= '';
        this.numdoc= 0;
        
        location.reload();
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

    //guardamos el cliente nuevo
    this.userService.crearCliente(data).subscribe(
      resp =>{
        console.log(resp);
        // Swal.fire('Success', resp, 'error');
        Swal.fire('Agregado', `Cliente agregado correctamente`, 'success');

        // CODIGO CAMBIADO DE LUGAR POR JOSE PRADOS
        // traemos este mismo registro
        this.userService.getClient(this.numdoc).subscribe(
          (numdoc) =>{
            this.clienteGuardado = numdoc;
            console.log(this.clienteGuardado);
            // definir cliente seleccionado luego del registro
            this.clienteSeleccionado = numdoc;
            localStorage.setItem('cliente', JSON.stringify(this.clienteGuardado));
          }
        );

      },(err) => {
        Swal.fire('Error', err.error.msg, 'error');
      }
    );

    // traemos este mismo registro
    // this.userService.getClient(this.numdoc).subscribe(
    //    (numdoc) =>{
    //     this.clienteGuardado = numdoc;
    //     console.log(this.clienteGuardado);
    //     localStorage.setItem('cliente', JSON.stringify(this.clienteGuardado));
    // })
    

    
  }

  // close_alert(){
  //   this.msm_error = false;
  //   this.msm_success = false;
  // }

  close_toast(){
    $('#dark-toast').removeClass('show');
        $('#dark-toast').addClass('hide');
  }

  init_data(_id:string){
    this.productoService.getProductoById(_id).subscribe(
      response =>{
        this.productoSeleccionado = response;
        console.log('prod obtenido: ',this.productoSeleccionado)


        if(this.clienteSeleccionado){
          this._ventaService.evaluar_venta_user(this.clienteSeleccionado.uid,this.productoSeleccionado._id).subscribe(
            response =>{
              console.log('resp venta: ',response)
              this.get_state_user_producto_coment = response.data;
            }
          );
        }

        // this.data_comentarios();

        $('#detalle').html(this.productoSeleccionado.detalle);
        // $('#video_iframe').append(this.producto.video_review);
        // $('iframe').removeAttr('height');
        // $('iframe').attr('height','400px');


        this.precio_to_cart = this.productoSeleccionado.precio_ahora;


      }
    );
  }

  cargarPorducto(prod:any){
    // guardar el producto seleccionado
    this.productoSeleccionado = prod;

    // abrir modal cargando
    this.abrirModalCargando();

    // cargar colores
    this._colorService.colorByProduct(prod._id).subscribe(
      response =>{
        console.log('colours: ',response)
        this.colores = response;
        this.color_to_cart = this.colores[0].color;
        console.log('colores prod select: ',response);

        // obtener selectores
        this._selectorService.selectorByProduct(prod._id).subscribe(
          response =>{
            this.selectores = response;
            console.log('selectores prod select: ',this.selectores);

            this.cerrarModalCargando();
            
            this.productNotSelected = false;
            
          }
        );

      }
    );
  }

  add_to_cart(carritoForm){
    if(this.cantidad_to_cart > parseInt(this.productoSeleccionado.stock)){
      this.err_stock = 'La cantidad no debe superar al stock';
    }
    else if(this.cantidad_to_cart <= 0){
      this.err_stock = 'La cantidad no puede ser un valor negativo';
    }
    else{
      this.err_stock = '';
      let data = {
        user: this.clienteSeleccionado.uid,
        producto : this.productoSeleccionado._id,
        cantidad : this.cantidad_to_cart,
        color : this.color_to_cart,
        selector : this.selector_to_cart,
        precio : this.productoSeleccionado.precio_ahora,
      }
      console.log('data product: ',data)
      if(this.selector_to_cart != " "){
        this.selector_error = false;
        this._carritoService.registro(data).subscribe(
          response =>{
            this.socket.emit('save-carrito', {new:true});
            // $('#dark-toast').removeClass('hide');
            // $('#dark-toast').addClass('show');
            // setTimeout(function() {
            //     $("#dark-toast").fadeOut(1500);
            // },3000);
            this.msm_success = true;
            setTimeout(()=>{
              this.close_alert()
            },2500);
          }
        );
      }else{
        this.selector_error = true;
      }
    }
  
  }

  getColorProducto(_id:string){
    this._colorService.colorByProduct(_id).subscribe(
      response =>{
        this.colores = response;
        this.color_to_cart = this.colores[0].color;
        console.log('colores: ',response);

      },
      error=>{

      }
    );
  }

  // metodo llamado desde el formulario para modificar el color que se seleccione con un click
  get_color(color:any){
    this.color_to_cart = color.color;
    console.log('color elegido: ',this.color_to_cart);
  }

  private abrirModalCargando(){
    // console.log('producto seleccionado: ',prod)
    // Abre el modal con el spinner
    Swal.fire({
      title: 'Cargando...',
      text: 'Por favor, espera',
      allowOutsideClick: false,
      didOpen: () => {
      Swal.showLoading();
      }
    });
    // 
  }

  private cerrarModalCargando(){
    Swal.close();
  }

  // metodo para volver a habilitar el section de todos los productos
  volverProductos(){
    this.selectores = [];
    this.colores = [];
    this.selector_to_cart = ' ';
    this.precio_to_cart = null;
    this.color_to_cart = '';
    this.productNotSelected = true;
  }

  close_alert(){
    this.msm_error = false;
    this.msm_error_review = '';
    this.msm_success_fav = false;
    this.msm_success = false;
  }


  //obtenemos las subcategorias de los productos
  
  optionSelected(value: number) {
    this.option_selectedd = value;
    if (this.option_selectedd === 1) {

      // this.ngOnInit();
    }
    if (this.option_selectedd === 2) {
      this.solicitud_selectedd = null;
    }
    if (this.option_selectedd === 3) {
      this.solicitud_selectedd = null;
    }
    if (this.option_selectedd === 4) {
      this.solicitud_selectedd = null;
    }
  }
}