import { Component, Input } from '@angular/core';
import { Producto } from 'src/app/models/producto.model';
import { CarritoService } from 'src/app/services/carrito.service';
import { environment } from 'src/environments/environment';
import * as io from 'socket.io-client';
import Swal from 'sweetalert2';
import { ColorService } from 'src/app/services/color.service';
import { SelectorService } from 'src/app/services/selector.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-productoSelected',
  templateUrl: './productoSelected.component.html',
  styleUrls: ['./productoSelected.component.css'],
})
export class ProductoSelectedComponent {
  public socket = io(environment.soketServer);

  @Input() productoSeleccionado;
  @Input() productNotSelected;
  @Input() msm_success;
  @Input() colores;
  @Input() clienteSeleccionado;

  @Input() cantidad_to_cart = 1;
  @Input() precio_to_cart;
  @Input() err_stock = '';

  @Input() color_to_cart;
  @Input() selectores: any = [];
  @Input() selector_to_cart = ' ';
  @Input() selector_error = false;
  @Input() producto: Producto;
  public msm_error_review = '';
  public msm_error = false;
  public msm_success_fav = false;
  public identity;
  constructor(
    private _carritoService: CarritoService,
    private _colorService: ColorService,
    private _selectorService: SelectorService,
    private userService: UsuarioService
  ) {
    this.identity = userService.usuario;
  }

  ngOnInit(): void {
    this.socket.on(
      'new-stock',
      function (data) {
        this.init_data();
      }.bind(this)
    );
  }

  add_to_cart(carritoForm) {
    if (this.cantidad_to_cart > parseInt(this.productoSeleccionado.stock)) {
      this.err_stock = 'La cantidad no debe superar al stock';
    } else if (this.cantidad_to_cart <= 0) {
      this.err_stock = 'La cantidad no puede ser un valor negativo';
    } else {
      this.err_stock = '';
      let data = {
        user: this.clienteSeleccionado.uid,
        producto: this.productoSeleccionado._id,
        cantidad: this.cantidad_to_cart,
        color: this.color_to_cart,
        selector: this.selector_to_cart,
        precio: this.productoSeleccionado.precio_ahora,
      };
      console.log('data product: ', data);
      if (this.selector_to_cart != ' ') {
        this.selector_error = false;
        this._carritoService.registro(data).subscribe((response) => {
          this.socket.emit('save-carrito', { new: true });
          // $('#dark-toast').removeClass('hide');
          // $('#dark-toast').addClass('show');
          // setTimeout(function() {
          //     $("#dark-toast").fadeOut(1500);
          // },3000);
          this.msm_success = true;
          setTimeout(() => {
            this.close_alert();
          }, 2500);
        });
      } else {
        this.selector_error = true;
      }
    }
  }

  getColorProducto(_id: string) {
    this._colorService.colorByProduct(_id).subscribe(
      (response) => {
        this.colores = response;
        this.color_to_cart = this.colores[0].color;
        console.log('colores: ', response);
      },
      (error) => {}
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
      },
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
    this.productNotSelected = false;
  }

  close_alert() {
    this.msm_error = false;
    this.msm_error_review = '';
    this.msm_success_fav = false;
    this.msm_success = false;
  }
}
