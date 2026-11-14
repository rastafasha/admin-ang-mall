import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { Categoria } from '../../../models/categoria.model';
import { CategoriaService } from '../../../services/categoria.service';
import { Producto } from '../../../models/producto.model';
import { ProductoService } from '../../../services/producto.service';
import { FormGroup } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { TranslateService } from '@ngx-translate/core';
import { MercadolibreService } from 'src/app/services/mercadolibre.service';
import { TiendaService } from 'src/app/services/tienda.service';
import { Tienda } from 'src/app/models/tienda.model';

declare var jQuery: any;
declare var $: any;
@Component({
  selector: 'app-prod-index',
  standalone: false,
  templateUrl: './prod-index.component.html',
  styleUrls: ['./prod-index.component.css']
})
export class ProdIndexComponent implements OnInit, OnDestroy {

  public productos: Producto[] = [];
  public producto: Producto;
  public categorias: Categoria[] = [];
  public cargando: boolean = true;
  public url;
  public totalProductos: number = 0;
  public desde: number = 0;

  // 🚀 2. VARIABLE PARA GESTIONAR EL LOADING POR CADA FILA DE PRODUCTO
  public cargandoSincronizacion: { [key: string]: boolean } = {};

  p: number = 1;
  count: number = 8;

  public imgSubs: Subscription;
  listIcons;

  public msm_error;

  query: string = '';
  searchForm!: FormGroup;
  currentPage = 1;
  collecion = 'productos';
  identity: Usuario;
  user: Usuario;
  productoSeleccionado: Producto;
  idLocal: string = '';
  tienda: Tienda;
  tienda_moneda: string;


  public verModalImportar: boolean = false;
  public usaMercadoLibre: boolean = false;

  public info: string = '';
  private langSubscription!: Subscription;

  totalProducts: number = 0;


  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private tiendaService: TiendaService,
    public translate: TranslateService,
    private meliService: MercadolibreService
  ) {
  }

  ngOnInit(): void {

    let USER = localStorage.getItem("user");
    this.user = USER ? JSON.parse(USER) : null;

    this.idLocal = this.user?.local || '';
    // 🟢 1. CARGA INICIAL DE LAS INSTRUCCIONES (Garantiza que la info no empiece vacía)
    this.translate.get('PRODUCTS.TITLE').subscribe(() => {
      this.actualizarInstruccionesPagos();
    });

    // 🟢 2. ESCUCHA SI CAMBIAN EL IDIOMA DESPUÉS (Mantiene tu lógica actual)
    this.langSubscription = this.translate.onLangChange.subscribe(() => {
      this.actualizarInstruccionesPagos();
    });

    if (this.user.role === 'SUPERADMIN') {
      this.loadProductos();
    }

    if (this.user.role === 'ADMIN' || this.user.role === 'VENTAS' || this.user.role === 'TIENDA' || this.user.role === 'ALMACEN') {
      this.getProductosbByTienda();
    }
    this.loadCategorias();
    this.getTienda();


  }

  private actualizarInstruccionesPagos() {
    // Jalamos los textos traducidos desde el JSON en milisegundos
    const title = this.translate.instant('PRODUCTS.TITLE');
    const subtitle = this.translate.instant('PRODUCTS.SUBTITLE');
    const item1 = this.translate.instant('PRODUCTS.ITEM_1');
    const item2 = this.translate.instant('PRODUCTS.ITEM_2');
    const item3 = this.translate.instant('PRODUCTS.ITEM_3');
    const item4 = this.translate.instant('PRODUCTS.ITEM_4');
    const item5 = this.translate.instant('PRODUCTS.ITEM_5');

    // Inyectamos el bloque HTML bilingüe estable en la propiedad
    this.info = `
    <h2>${title}</h2>
    <p>${subtitle}</p>
    <ul>
      <li>${item1}</li>
      <li>${item2}</li>
      <li>${item3}</li>
      <li>${item4}</li>
      <li>${item5}</li>
    </ul>
  `;
  }

  ngOnDestroy(): void {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }




  loadProductos() {
    this.cargando = true;
    this.productoService.cargarProductos(this.p, this.count).subscribe(
      (resp: any) => {
        this.productos = resp.productos || [];
        this.totalProducts = resp.total || 0;
        this.cargando = false;
      })
  }

 

  getTienda() {
    this.tiendaService.getTiendaById(this.idLocal).subscribe((resp: any) => {
      this.tienda = resp;
      this.usaMercadoLibre = this.tienda.usaMercadoLibre || null;
      this.tienda_moneda = resp.moneda;
    })
  }

  getProductosbByTienda() {
    this.cargando = true;
    this.productoService.getProductosTienda(this.user.local, this.p, this.count).subscribe((resp: any) => {
      this.productos = resp.productos || [];
      this.totalProducts = resp.total || 0;
      this.cargando = false;
    })
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
    }else{
      this.loadProductos(); // Al cambiar de página, hace una sola petición limpia
    }
  }

  loadCategorias() {
    this.cargando = true;
    this.categoriaService.cargarCategorias().subscribe(
      categorias => {
        this.categorias = categorias;
      })
  }

  /**
   * 🚀 4. NUEVA FUNCIÓN PARA EXPORTAR / ACTUALIZAR EL ÍTEM EN MERCADO LIBRE
   */
  sincronizarConMercadoLibre(producto: Producto): void {
    if (!producto._id) return;

    // Activamos la animación de carga exclusivamente para esta celda
    this.cargandoSincronizacion[producto._id] = true;

    this.meliService.exportarProducto(producto._id).subscribe({
      next: (resp) => {
        this.cargandoSincronizacion[producto._id!] = false;

        // Mutamos el estado reactivo del ítem local de forma inmediata para cambiar la interfaz
        if (!producto.mercadolibre) {
          producto.mercadolibre = { id: resp.ml_id, status: 'active', last_sync: new Date() };
        } else {
          producto.mercadolibre.id = resp.ml_id;
          producto.mercadolibre.last_sync = new Date();
        }

        Swal.fire({
          title: '¡Sincronizado con éxito!',
          text: resp.mensaje,
          icon: 'success',
          confirmButtonColor: '#2d3277'
        });
      },
      error: (err) => {
        this.cargandoSincronizacion[producto._id!] = false;

        // 🚀 LOG EN CONSOLA REVELADOR: Abre la consola del navegador (F12) y lee el objeto
        console.log('🔴 Error real devuelto por el Backend:', err);

        Swal.fire({
          title: 'Fallo de Sincronización',
          text: err.error?.mensaje || err.error?.msg || 'Revisa la consola para más detalles.',
          icon: 'error'
        });
      }
    });
  }


  eliminarProducto(producto: Producto) {
    Swal.fire({
      title: 'Estas Seguro?',
      text: 'No podras recuperarlo!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Borrar!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.cargando = true;
        this.productoService.borrarProducto(producto._id)
          .subscribe(resp => {
            this.ngOnInit();
          })
        Swal.fire('Borrado!', 'El Archivo fue borrado.', 'success');
      }
    });
  }

  public PageSize(): void {
    this.query = '';
    this.ngOnInit();
  }

  handleSearchEvent(event: any) {
    if (event.productos) {
      this.productos = event.productos;
    }
  }

  desactivar(id) {
    this.productoService.desactivar(id).subscribe(
      response => {
        $('#desactivar-' + id).modal('hide');
        $('.modal-backdrop').removeClass('show');
        this.ngOnInit();
        this.cleanModalBackdrop();
      },
      error => {
        this.msm_error = 'No se pudo desactivar el producto, vuelva a intenter.'
      }
    )
  }

  activar(id) {
    this.productoService.activar(id).subscribe(
      response => {

        $('#activar-' + id).modal('hide');
        $('.modal-backdrop').removeClass('show');
        this.ngOnInit();
        this.cleanModalBackdrop();
      },
      error => {
        this.msm_error = 'No se pudo activar el producto, vuelva a intenter.'
      }
    )
  }



  papelera(id) {
    this.productoService.papelera(id).subscribe(
      response => {
        $('#papelera-' + id).modal('hide');
        $('.modal-backdrop').removeClass('show');
        this.ngOnInit();
        this.cleanModalBackdrop();
      },
      error => {
        this.msm_error = 'No se pudo mover a papelera el producto, vuelva a intenter.'
      }
    )
  }

   cleanModalBackdrop() {
    // 1. Buscamos y removemos todos los elementos de backdrop del DOM
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(backdrop => backdrop.remove());

    // 2. Quitamos la clase 'modal-open' del body para que no bloquee el scroll de la página
    document.body.classList.remove('modal-open');

    // 3. Limpiamos estilos residuales de scroll que inyecta Bootstrap en el body
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }


  onEditColor(producto: Producto) { this.productoSeleccionado = producto; }
  onEditSelector(producto: Producto) { this.productoSeleccionado = producto; }
  onEditGaleria(producto: Producto) { this.productoSeleccionado = producto; }
  onEditProject(producto: Producto) { this.productoSeleccionado = producto; }
  openEditProductPapelera() { this.productoSeleccionado = null; }
  openEditModal(): void { this.productoSeleccionado = null; }
  onCloseModal(): void { this.productoSeleccionado = null; }
  onClose() { this.ngOnInit(); }

  openImportarExcel() {

  }



}
