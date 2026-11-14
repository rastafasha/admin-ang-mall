import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Categoria } from 'src/app/models/categoria.model';
import { Producto } from 'src/app/models/producto.model';
import { ColorService } from 'src/app/services/color.service';
import { GaleriaService } from 'src/app/services/galeria.service';
import { ProductoService } from 'src/app/services/producto.service';
import { SelectorService } from 'src/app/services/selector.service';
import { environment } from 'src/environments/environment';

import { io } from "socket.io-client";
import { Favorite } from 'src/app/models/favorite.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { MessageService } from 'src/app/services/message.service';
import { DomSanitizer } from '@angular/platform-browser';
import { VentaService } from 'src/app/services/venta.service';
import { CarritoService } from 'src/app/services/carrito.service';
import { ComentarioService } from 'src/app/services/comentario.service';
import { Usuario } from 'src/app/models/usuario.model';
import { CategoriaService } from 'src/app/services/categoria.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-producto',
  standalone: false,
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit, OnDestroy, OnChanges {

  // 🟢 INPUTS Y OUTPUTS PARA USARLO COMO COMPONENTE HIJO EN ATENCION-LOCAL
  @Input() producto: any = null;
  @Input() clienteSeleccionado: any = null;
  @Input() tienda_moneda: string = 'USD';
  @Output() volver = new EventEmitter<void>();

  public currentLang: string = 'es';
  private langSubscription!: Subscription;
  categories: Categoria[];
  public socket = io(environment.soketServer);

  public slug: Producto;
  public selectores: any = [];
  public galeria: any = [];
  public colores: any = [];
  public url;
  public img_select;
  public first_img;
  public cantidad_to_cart = 1;
  public precio_to_cart;
  public color_to_cart = '#16537e';
  public selector_to_cart = ' ';
  public err_stock = '';
  public selector_error = false;
  public identity;

  public comentarios: any = [];

  /*COMENTARIOS DATA */
  public cinco_estrellas = 0;
  public cuatro_estrellas = 0;
  public tres_estrellas = 0;
  public dos_estrellas = 0;
  public una_estrella = 0;

  public cinco_porcent = 0;
  public cuatro_porcent = 0;
  public tres_porcent = 0;
  public dos_porcent = 0;
  public uno_porcent = 0;
  public raiting_porcent = 0;
  public total_puntos = 0;
  public max_puntos = 0;
  public raiting_puntos = 0;

  /*PAGINATE COMENTS */
  public page;
  public pageSize = 5;
  public count_cat;
  public sort_data_coment = 'raiting';

  /*FORM RESEÑA */
  public id_review_producto;
  public review_comentario = '';
  public review_pros = '';
  public review_cons = '';
  public review_estrellas = '';

  public msm_error_review = '';
  public msm_error = false;
  public msm_success_fav = false;
  public msm_success = false;
  productoSeleccionado: Producto;
  favoriteItem: Favorite;

  public get_state_user_producto_coment = false;

  /*NEWST */

  public news_productos: any = {};

  public data_cupon;

  public selectorSeleccionadoObj: any = null;

  constructor(
    public productoService: ProductoService,
    public categoryService: CategoriaService,
    public usuarioService: UsuarioService,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    private sanitizer: DomSanitizer,
    private _galeriaService: GaleriaService,
    private _colorService: ColorService,
    private _selectorService: SelectorService,
    private _ventaService: VentaService,
    private _carritoService: CarritoService,
    private _comentarioService: ComentarioService,
    public translate: TranslateService,
  ) {
    this.url = environment.baseUrl;
    this.identity = usuarioService.usuario;
  }

  ngOnInit(): void {
    this.currentLang = this.translate.currentLang || this.translate.getDefaultLang() || 'es';
    this.langSubscription = this.translate.onLangChange.subscribe((event) => {
      this.currentLang = event.lang;
      if (this.selectorSeleccionadoObj) {
        this.seleccionarOpcion(this.selectorSeleccionadoObj);
      }
    });

    // Si se abre por ruta directa (con :id) en lugar de como hijo
    this.activatedRoute.params.subscribe(params => {
      if (params['id'] && !this.producto) {
        this.productoService.getProductoById(params['id']).subscribe(resp => {
          this.producto = resp;
          this.inicializarVariantesProducto(resp._id);
        });
      }
    });

    if (!this.clienteSeleccionado) {
      const cliente = localStorage.getItem('cliente');
      if (cliente) this.clienteSeleccionado = JSON.parse(cliente);
    }

  }

  // 🟢 SE DISPARA CADA VEZ QUE ATENCION-LOCAL LE PASA UN NUEVO PRODUCTO
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['producto'] && this.producto?._id) {
      this.resetearEstados();
      this.inicializarVariantesProducto(this.producto._id);
    }
  }

  ngOnDestroy(): void {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }

  private resetearEstados() {
    this.cantidad_to_cart = 1;
    this.precio_to_cart = this.producto?.precio_ahora || 0;
    this.first_img = '';
    this.galeria = [];
    this.colores = [];
    this.selectores = [];
    this.color_to_cart = '';
    this.selector_to_cart = '';
    this.selectorSeleccionadoObj = null;
    this.err_stock = '';
    this.selector_error = false;
    this.msm_success = false;
  }

  private inicializarVariantesProducto(productId: string) {
    // 1. Galería
    this._galeriaService.find_by_product(productId).subscribe({
      next: (res) => {
        this.galeria = res?.galeria || [];
        if (this.galeria.length > 0) {
          this.first_img = this.galeria.imagen;
        }
      }
    });

    // 2. Colores
    this._colorService.colorByProduct(productId).subscribe({
      next: (res) => {
        this.colores = res || [];
        if (this.colores.length > 0) {
          this.color_to_cart = this.colores.color;
        }
      }
    });

    // 3. Selectores (Medidas / Tallas)
    this._selectorService.selectorByProduct(productId).subscribe({
      next: (res) => {
        this.selectores = res || [];
        if (this.selectores.length > 0) {
          this.seleccionarOpcion(this.selectores);
        }
      }
    });
  }


  click_img(img: string) {
    this.first_img = img;
  }

  get_color(color: any) {
    this.color_to_cart = color.color;
  }




  // Método para las píldoras:
  seleccionarOpcion(selector: any) {
    if (!selector || !selector.titulo) return;
    this.selectorSeleccionadoObj = selector;
    this.selector_to_cart = typeof selector.titulo === 'object'
      ? (this.currentLang === 'en' ? (selector.titulo.en || selector.titulo.es) : selector.titulo.es)
      : selector.titulo;
    this.selector_error = false;
  }

  add_to_cart(carritoForm: any) {
    // Validar cliente
    const clienteStorage = localStorage.getItem('cliente');
    const clienteActual = this.clienteSeleccionado || (clienteStorage ? JSON.parse(clienteStorage) : null);

    if (!clienteActual || !clienteActual.uid) {
      this.err_stock = 'Por favor selecciona o registra un cliente primero.';
      return;
    }

    if (this.cantidad_to_cart > parseInt(this.producto.stock)) {
      this.err_stock = 'La cantidad no debe superar al stock';
      return;
    }

    if (this.cantidad_to_cart <= 0) {
      this.err_stock = 'La cantidad no puede ser un valor negativo';
      return;
    }

    const requiereSelector = this.selectores.length > 0 && this.producto.nombre_selector?.toLowerCase() !== 'unico';
    if (requiereSelector && !this.selector_to_cart.trim()) {
      this.selector_error = true;
      return;
    }

    this.err_stock = '';
    this.selector_error = false;

    const data = {
      user: clienteActual.uid,
      producto: this.producto._id,
      cantidad: this.cantidad_to_cart,
      color: this.color_to_cart || '#000000',
      selector: this.selector_to_cart || 'Único',
      precio: this.producto.precio_ahora,
    };

    this._carritoService.registro(data).subscribe({
      next: () => {
        this.socket.emit('save-carrito', { new: true });
        this.msm_success = true;
        setTimeout(() => this.close_alert(), 2500);
      },
      error: (err) => {
        console.error(err);
        this.err_stock = 'Error al agregar al carrito';
      }
    });
  }



  close_alert() {
    this.msm_error = false;
    this.msm_error_review = '';
    this.msm_success_fav = false;
    this.msm_success = false;

  }

  volverAtras() {
    if (this.volver.observers.length > 0) {
      this.volver.emit(); // Si está dentro de atencion-local, avisa al padre
    } else {
      this.router.navigateByUrl('/dashboard/productos'); // Si entró por URL directa
    }
  }

}
