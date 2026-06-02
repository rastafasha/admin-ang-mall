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

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private usuarioService: UsuarioService,
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
            if (this.user.role === 'SUPERADMIN') {
              this.cargando = false;
              this.loadProductos();
            }

            if (this.user.role === 'ADMIN' || this.user.role === 'VENTAS' || this.user.role === 'TIENDA' || this.user.role === 'ALMACEN') {
              this.getProductosbByTienda();
              this.cargando = false;
            }
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
        if (this.user.role === 'SUPERADMIN') {
          this.loadProductos();
        }
        if (this.user.role === 'ADMIN' || this.user.role === 'VENTAS' || this.user.role === 'TIENDA' || this.user.role === 'ALMACEN') {
          this.getProductosbByTienda();
        }
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
        if (this.user.role === 'SUPERADMIN') {
          this.loadProductos();
        }

        if (this.user.role === 'ADMIN' || this.user.role === 'VENTAS' || this.user.role === 'TIENDA' || this.user.role === 'ALMACEN') {
          this.getProductosbByTienda();
        }
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
        if (this.user.role === 'SUPERADMIN') {
          this.loadProductos();
        }

        if (this.user.role === 'ADMIN' || this.user.role === 'VENTAS' || this.user.role === 'TIENDA' || this.user.role === 'ALMACEN') {
          this.getProductosbByTienda();
        }
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

  onClose() { }



}
