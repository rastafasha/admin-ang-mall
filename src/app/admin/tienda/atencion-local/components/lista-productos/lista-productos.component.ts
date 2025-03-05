import { Component, Input } from '@angular/core';
import { Producto } from 'src/app/models/producto.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { CategoriaService } from 'src/app/services/categoria.service';
import { ColorService } from 'src/app/services/color.service';
import { ProductoService } from 'src/app/services/producto.service';
import { SelectorService } from 'src/app/services/selector.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista-productos',
  templateUrl: './lista-productos.component.html',
  styleUrls: ['./lista-productos.component.css'],
})
export class ListaProductosComponent {
  @Input() productos;
  @Input() count;
  @Input() p;
  @Input() colores;
  @Input() color_to_cart;
  @Input() selector_to_cart;
  @Input() precio_to_cart;
  public productoSeleccionado: Producto;
  public productNotSelected = false;
  public selectores: any = [];
  
  cargando = false;
  constructor(
    private _colorService: ColorService,
    private _selectorService: SelectorService,
    private busquedaService: BusquedasService,
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
  ) {}

  buscar(termino: string) {
    // if(termino.length === 0){
    //   return this.loadCategorias();
    // }

    this.busquedaService
      .buscar('productos', termino)
      .subscribe((resultados) => {
        resultados;
      });
  }


  
  cargarPorducto(prod: any) {
    // guardar el producto seleccionado
    this.productoSeleccionado = prod;

    // abrir modal cargando
    this.abrirModalCargando();

    // cargar colores
    this._colorService.colorByProduct(prod._id).subscribe((response) => {
      console.log('colours: ', response);
      this.colores = response;
      this.color_to_cart = this.colores[0].color;
      console.log('colores prod select: ', response);

      // obtener selectores
      this._selectorService
        .selectorByProduct(prod._id)
        .subscribe((response) => {
          this.selectores = response;
          console.log('selectores prod select: ', this.selectores);

          this.cerrarModalCargando();

          this.productNotSelected = true;
        });
    });
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

  volverProductos() {
    this.selectores = [];
    this.colores = [];
    this.selector_to_cart = ' ';
    this.precio_to_cart = null;
    this.color_to_cart = '';
    this.productNotSelected = false;
  }
}
