import { Component, Input, OnDestroy, OnInit } from '@angular/core';
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
import { io } from "socket.io-client";
import { CarritoService } from 'src/app/services/carrito.service';
import { ColorService } from 'src/app/services/color.service';
import { SelectorService } from 'src/app/services/selector.service';
import { VentaService } from 'src/app/services/venta.service';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-atencion-local',
  standalone: false,
  templateUrl: './atencion-local.component.html',
  styleUrls: ['./atencion-local.component.css']
})
export class AtencionLocalComponent implements OnInit, OnDestroy {

  public socket = io(environment.soketServer);

  @Input() cartItem: CartItemModel;
  cartItems: any[] = [];

  @Input() clienteSeleccionado: any;

  public clienteConfirmado: boolean = false;

  public cantidad_to_cart = 1;
  public precio_to_cart;
  public err_stock = '';
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


  public productos: Producto[] = [];
  public categorias: Categoria[] = [];
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

  public msm_error_review = '';
  public msm_error = false;
  public msm_success_fav = false;
  public msm_success = false;

  public get_state_user_producto_coment = false;


  public productoSeleccionado: Producto;
  public clienteGuardado: Usuario;

  public identity;

  public colores: any = [];
  public color_to_cart = '#16537e';
  public selectores: any = [];
  public selector_to_cart = ' ';

  productNotSelected: boolean = true;

  query: string = '';
  searchForm!: FormGroup;
  currentPage = 1;
  collecion = 'productos';
  public info: string = '';
  private langSubscription!: Subscription;

  totalProducts: number = 0;
  public todosLosProductos: any[] = [];

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private modalImagenService: ModalImagenService,
    private userService: UsuarioService,
    private translate: TranslateService,
    private tiendaService: TiendaService,
    private _carritoService: CarritoService,
    private _colorService: ColorService,
    private _selectorService: SelectorService,
    private router: Router,
    private _ventaService: VentaService,
  ) {

    this.identity = userService.usuario;
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    // obtenemos el cliente del localstorage
    const cliente = localStorage.getItem('cliente');
    // Si el cliente existe, lo parseamos de JSON a un objeto
    // 🟢 1. CARGA INICIAL DE LAS INSTRUCCIONES (Garantiza que la info no empiece vacía)
    this.translate.get('LOCAL_ATENTION.TITLE').subscribe(() => {
      this.actualizarInstruccionesPagos();
    });

    // 🟢 2. ESCUCHA SI CAMBIAN EL IDIOMA DESPUÉS (Mantiene tu lógica actual)
    this.langSubscription = this.translate.onLangChange.subscribe(() => {
      this.actualizarInstruccionesPagos();
    });

    if (cliente) {
      this.clienteSeleccionado = JSON.parse(cliente);
      this.loadClienteenProceso();
      if (this.clienteSeleccionado && this.clienteSeleccionado !== 404 && this.clienteSeleccionado.first_name) {
        this.clienteConfirmado = true;
      }
    }

    if (!this.identity) {
      this.router.navigate(['/login']);
    }

    this.socket.on('new-stock', function (data) {
      this.init_data();

    }.bind(this));


    this.uploads();


  }

  private actualizarInstruccionesPagos() {
    // Jalamos los textos traducidos desde el JSON en milisegundos
    const title = this.translate.instant('LOCAL_ATENTION.TITLE');
    const subtitle = this.translate.instant('LOCAL_ATENTION.SUBTITLE');
    const item1 = this.translate.instant('LOCAL_ATENTION.ITEM_1');
    const item2 = this.translate.instant('LOCAL_ATENTION.ITEM_2');
    const item3 = this.translate.instant('LOCAL_ATENTION.ITEM_3');
    const item4 = this.translate.instant('LOCAL_ATENTION.ITEM_4');

    // Inyectamos el bloque HTML bilingüe estable en la propiedad
    this.info = `
    <h2>${title}</h2>
    <p>${subtitle}</p>
    <ul>
      <li>${item1}</li>
      <li>${item2}</li>
      <li>${item3}</li>
      <li>${item4}</li>
    </ul>
  `;
  }
  ngOnDestroy(): void {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
    this.imgSubs.unsubscribe();
  }




  private uploads() {

    if (!this.identity) {
      this.router.navigateByUrl('/login');
    }


    let USER = localStorage.getItem("user");
    this.user = JSON.parse(USER ? USER : '');
    this.local = this.user.local;

    if (this.user.role === 'SUPERADMIN') {
      this.loadProductos();
    }

    if (this.user.role === 'ADMIN' || this.user.role === 'VENTAS' || this.user.role === 'TIENDA' || this.user.role === 'ALMACEN') {
      this.getLocal();
    }


    this.loadCategorias();
    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(
        delay(100)
      )
      .subscribe(img => { this.loadProductos(); });
  }

  loadProductos() {
    this.cargando = true;
    this.productoService.cargarProductosActivos().subscribe(
      productos => {
        this.cargando = false;
        this.productos = productos;
      }
    )

  }

  loadClienteenProceso() {
    const cliente = localStorage.getItem('cliente');
    this.clienteSeleccionado = JSON.parse(cliente);


    if (this.clienteSeleccionado === 404) {
      this.clienteSeleccionado.first_name = '';
      this.clienteSeleccionado.last_name = '';
      this.clienteSeleccionado.email = '';
      this.clienteSeleccionado.telefono = '';
      this.clienteSeleccionado.numdoc = 0;
    } else {
      this.first_name = this.clienteSeleccionado.first_name;
      this.last_name = this.clienteSeleccionado.last_name;
      this.email = this.clienteSeleccionado.email;
      this.telefono = this.clienteSeleccionado.telefono;
      this.numdoc = this.clienteSeleccionado.numdoc;
    }
  }

  loadCategorias() {
    this.cargando = true;
    this.categoriaService.cargarCategorias().subscribe(
      categorias => {
        this.categorias = categorias;
        this.cargando = false;
      }
    )


  }

  getLocal() {
    this.tiendaService.getTiendaById(this.user.local).subscribe(tienda => {
      this.tienda = tienda;
      this.tienda_moneda = tienda.moneda;
      this.activeCategory = tienda.categoria.nombre;
      this.getProductosbByTienda();
      // this.getProductosCatName();

    })
  }

getProductosbByTienda() {
  this.cargando = true;
  // Pedimos todos los productos activos (ej. 500) para que salgan TODAS las categorías en el POS
  this.productoService.getProductosTienda(this.user.local, 1, 500).subscribe({
    next: (resp: any) => {
      const lista = Array.isArray(resp) ? resp : (resp?.productos || []);
      this.todosLosProductos = lista;
      this.productos = [...lista];

      // Extraemos subcategorías únicas normalizadas (sin espacios extra)
      const mapaSubcategorias = new Map<string, { nombre: string; products: any[] }>();

      lista.forEach((producto: any) => {
        const subRaw = typeof producto.subcategoria === 'object'
          ? (producto.subcategoria?.es || '')
          : (producto.subcategoria || '');

        const nombreLimpio = subRaw.trim();
        if (!nombreLimpio) return;

        const clave = nombreLimpio.toLowerCase();
        if (!mapaSubcategorias.has(clave)) {
          mapaSubcategorias.set(clave, {
            nombre: nombreLimpio,
            products: []
          });
        }
        mapaSubcategorias.get(clave)!.products.push(producto);
      });

      this.subcategories = Array.from(mapaSubcategorias.values());
      this.activeCategory = 'all';
      this.cargando = false;
    },
    error: (err) => {
      console.error('Error al cargar productos:', err);
      this.todosLosProductos = [];
      this.productos = [];
      this.subcategories = [];
      this.cargando = false;
    }
  });
}

selectCategory(category: string) {
  this.activeCategory = category;
  if (category === 'all') {
    this.productos = [...this.todosLosProductos];
  } else {
    const encontrada = this.subcategories.find(
      subcat => subcat.nombre.toLowerCase() === category.toLowerCase()
    );
    this.productos = encontrada ? [...encontrada.products] : [];
  }
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
    if (this.user.role === 'SUPERADMIN') {
      this.loadProductos()
    }
    if (this.user.role === 'ADMIN' || this.user.role === 'VENTAS') {
      this.getLocal();
    }
    // this.router.navigateByUrl('/productos')
  }

  handleSearchEvent(event: any) {
    if (event.productos) {
      this.productos = event.productos;
    }
  }


  filterClient() {
    // localStorage.removeItem('cliente');
    this.userService.getClient(this.numdoc).subscribe(numdoc => {
      console.log(numdoc);
      this.clienteSeleccionado = numdoc; // se obtiene el cliente por la cedula para relacionar la compra
      // y se envia como un input a producto y al carrito

      if (this.clienteSeleccionado === 404) {
        this.clienteSeleccionado.first_name = '';
        this.clienteSeleccionado.last_name = '';
        this.clienteSeleccionado.email = '';
        this.clienteSeleccionado.telefono = '';
        this.clienteSeleccionado.n_doc = 0;
      } else {
        this.first_name = this.clienteSeleccionado.first_name;
        this.last_name = this.clienteSeleccionado.last_name;
        this.email = this.clienteSeleccionado.email;
        this.telefono = this.clienteSeleccionado.telefono;
        this.numdoc = this.clienteSeleccionado.n_doc;
      }
    })
  }

  adjuntarClienteaCompra() {
    if (!this.clienteSeleccionado || this.clienteSeleccionado === 404) return;
    localStorage.setItem('cliente', JSON.stringify(this.clienteSeleccionado));
    this.clienteConfirmado = true; // 👈 Colapsa el formulario a la barra compacta
  }

  editarCliente() {
    this.clienteConfirmado = false; // 👈 Vuelve a desplegar el formulario si quieren editar o buscar otro
  }

  resetClient() {
    localStorage.removeItem('cliente');
    this.clienteSeleccionado = null;
    this.clienteConfirmado = false;
    this.first_name = '';
    this.last_name = '';
    this.email = '';
    this.telefono = '';
    this.numdoc = null;
  }

  /**
* Función para los botones de Siguiente y Anterior del paginador
*/
  cambiarPagina(valor: number): void {
    const nuevoDesde = this.desde + valor;

    // Validaciones de seguridad para no salirnos del rango real de la BD
    if (nuevoDesde < 0) return;
    if (nuevoDesde >= this.totalProducts) return;

    this.desde = nuevoDesde;
    if (this.user.role === 'ADMIN' || this.user.role === 'VENTAS' || this.user.role === 'TIENDA' || this.user.role === 'ALMACEN') {
      this.getProductosbByTienda();
    } else {
      this.loadProductos(); // Al cambiar de página, hace una sola petición limpia
    }
  }


  addClient() {

    let data = {
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      numdoc: this.numdoc,
      telefono: this.telefono,
      password: this.telefono,
      role: 'USER',
    }

    //guardamos el cliente nuevo
    this.userService.crearCliente(data).subscribe(
      resp => {
        console.log(resp);
        // Swal.fire('Success', resp, 'error');
        Swal.fire('Agregado', `Cliente agregado correctamente`, 'success');

        // CODIGO CAMBIADO DE LUGAR POR JOSE PRADOS
        // traemos este mismo registro
        this.userService.getClient(this.numdoc).subscribe(
          (numdoc) => {
            this.clienteGuardado = numdoc;
            // definir cliente seleccionado luego del registro
            this.clienteSeleccionado = numdoc;
            
            localStorage.setItem('cliente', JSON.stringify(this.clienteGuardado));
          }
        );

        this.clienteConfirmado = true;

      }, (err) => {
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

  close_toast() {
    $('#dark-toast').removeClass('show');
    $('#dark-toast').addClass('hide');
  }

  init_data(_id: string) {
    this.productoService.getProductoById(_id).subscribe(
      response => {
        this.productoSeleccionado = response;
        console.log('prod obtenido: ', this.productoSeleccionado)


        if (this.clienteSeleccionado) {
          this._ventaService.evaluar_venta_user(this.clienteSeleccionado.uid, this.productoSeleccionado._id).subscribe(
            response => {
              console.log('resp venta: ', response)
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

  cargarPorducto(prod: any) {
    // guardar el producto seleccionado
    this.productoSeleccionado = prod;

    // abrir modal cargando
    this.abrirModalCargando();

    // cargar colores
    this._colorService.colorByProduct(prod._id).subscribe(
      response => {
        console.log('colours: ', response)
        this.colores = response;
        this.color_to_cart = this.colores[0].color;
        console.log('colores prod select: ', response);

        // obtener selectores
        this._selectorService.selectorByProduct(prod._id).subscribe(
          response => {
            this.selectores = response;
            console.log('selectores prod select: ', this.selectores);

            this.cerrarModalCargando();

            this.productNotSelected = false;

          }
        );

      }
    );
  }

  add_to_cart(carritoForm) {
    if (this.cantidad_to_cart > parseInt(this.productoSeleccionado.stock)) {
      this.err_stock = 'La cantidad no debe superar al stock';
    }
    else if (this.cantidad_to_cart <= 0) {
      this.err_stock = 'La cantidad no puede ser un valor negativo';
    }
    else {
      this.err_stock = '';
      let data = {
        user: this.clienteSeleccionado.uid,
        producto: this.productoSeleccionado._id,
        cantidad: this.cantidad_to_cart,
        color: this.color_to_cart,
        selector: this.selector_to_cart,
        precio: this.productoSeleccionado.precio_ahora,
      }
      console.log('data product: ', data)
      if (this.selector_to_cart != " ") {
        this.selector_error = false;
        this._carritoService.registro(data).subscribe(
          response => {
            this.socket.emit('save-carrito', { new: true });
            // $('#dark-toast').removeClass('hide');
            // $('#dark-toast').addClass('show');
            // setTimeout(function() {
            //     $("#dark-toast").fadeOut(1500);
            // },3000);
            this.msm_success = true;
            setTimeout(() => {
              this.close_alert()
            }, 2500);
          }
        );
      } else {
        this.selector_error = true;
      }
    }

  }

  getColorProducto(_id: string) {
    this._colorService.colorByProduct(_id).subscribe(
      response => {
        this.colores = response;
        this.color_to_cart = this.colores[0].color;
        console.log('colores: ', response);

      },
      error => {

      }
    );
  }

  // metodo llamado desde el formulario para modificar el color que se seleccione con un click
  get_color(color: any) {
    this.color_to_cart = color.color;
    console.log('color elegido: ', this.color_to_cart);
  }

  private abrirModalCargando() {
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

  private cerrarModalCargando() {
    Swal.close();
  }

  // metodo para volver a habilitar el section de todos los productos
  volverProductos() {
    this.selectores = [];
    this.colores = [];
    this.selector_to_cart = ' ';
    this.precio_to_cart = null;
    this.color_to_cart = '';
    this.productNotSelected = true;
  }

  close_alert() {
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
  }
}