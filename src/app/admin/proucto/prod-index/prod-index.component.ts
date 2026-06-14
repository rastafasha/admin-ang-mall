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

declare var jQuery: any;
declare var $: any;
@Component({
  selector: 'app-prod-index',
  standalone: false,
  templateUrl: './prod-index.component.html',
  styleUrls: ['./prod-index.component.css']
})
export class ProdIndexComponent implements OnInit {

  public productos: Producto[] = [];
  public producto: Producto;
  public categorias: Categoria[] = [];
  public cargando: boolean = true;
  public url;
  public totalProductos: number = 0;
  public desde: number = 0;

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

  public info: string = '';
  private langSubscription!: Subscription;
  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private usuarioService: UsuarioService,
    public translate: TranslateService
  ) {
  }

  ngOnInit(): void {

    let USER = localStorage.getItem("user");
    this.user = USER ? JSON.parse(USER) : null;
    if (this.user.role === 'SUPERADMIN') {
      this.loadProductos();
    }

    if (this.user.role === 'ADMIN' || this.user.role === 'VENTAS' || this.user.role === 'TIENDA' || this.user.role === 'ALMACEN') {
      this.getProductosbByTienda();
    }
    this.loadCategorias();

    this.langSubscription = this.translate.onLangChange.subscribe(() => {
      this.actualizarInstruccionesPagos();
    });
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



  loadProductos() {
    this.cargando = true;
    this.productoService.cargarProductos().subscribe(
      productos => {
        this.cargando = false;
        this.productos = productos;
      })
  }

  getProductosbByTienda() {
    this.cargando = true;
    this.productoService.getProductosTienda(this.user.local).subscribe(productos => {
      this.productos = productos;
      this.cargando = false;
    })
  }

  loadCategorias() {
    this.cargando = true;
    this.categoriaService.cargarCategorias().subscribe(
      categorias => {
        this.categorias = categorias;
      })
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
      },
      error => {
        this.msm_error = 'No se pudo mover a papelera el producto, vuelva a intenter.'
      }
    )
  }

  onEditColor(producto: Producto) {
    this.productoSeleccionado = producto;
  }
  onEditSelector(producto: Producto) {
    this.productoSeleccionado = producto;
  }
  onEditGaleria(producto: Producto) {
    this.productoSeleccionado = producto;
  }
  onEditProject(producto: Producto) {
    this.productoSeleccionado = producto;
  }
  openEditProductPapelera() {
    this.productoSeleccionado = null;
  }

  openEditModal(): void {
    this.productoSeleccionado = null;
  }

  onCloseModal(): void {
    this.productoSeleccionado = null;

  }

  onClose() {
    this.ngOnInit();
  }



}
