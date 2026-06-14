import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { delay } from 'rxjs/operators';
import { BusquedasService } from '../../../services/busquedas.service';
import { Categoria } from '../../../models/categoria.model';
import { CategoriaService } from '../../../services/categoria.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { IconosService } from 'src/app/services/iconos.service';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SidebarService } from 'src/app/services/sidebar.service';

declare var jQuery: any;
declare var $: any;
@Component({
  selector: 'app-cat-index',
  standalone: false,
  templateUrl: './cat-index.component.html',
  styleUrls: ['./cat-index.component.css']
})
export class CatIndexComponent implements OnInit, OnDestroy {

  public categorias: Categoria[] = [];
  public categoria: Categoria;
  public cargando: boolean = true;

  public totalCategorias: number = 0;
  public desde: number = 0;

  p: number = 1;
  count: number = 8;

  public imgSubs: Subscription;
  listIcons;
  user: any;

  query: string = '';
  searchForm!: FormGroup;
  currentPage = 1;
  collecion = 'categorias';

  public msm_error;
  categoriaSeleccionado: Categoria;
  public info: string = '';
  private langSubscription!: Subscription;
  

  constructor(
    private categoriaService: CategoriaService,
    private modalImagenService: ModalImagenService,
    private _iconoService: IconosService,
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    let USER = localStorage.getItem("user");
    this.user = JSON.parse(USER ? USER : '');
    this.cargar_iconos();
    // 🟢 1. CARGA INICIAL DE LAS INSTRUCCIONES (Garantiza que la info no empiece vacía)
    this.translate.get('CATEGORY.TITLE').subscribe(() => {
      this.actualizarInstruccionesPagos();
    });

    // 🟢 2. ESCUCHA SI CAMBIAN EL IDIOMA DESPUÉS (Mantiene tu lógica actual)
    this.langSubscription = this.translate.onLangChange.subscribe(() => {
      this.actualizarInstruccionesPagos();
    });

    if (this.user.role === 'SUPERADMIN') {
      this.loadCategorias();
    }

    if (this.user.role === 'ADMIN' || this.user.role === 'VENTAS' || this.user.role === 'TIENDA' || this.user.role === 'ALMACEN') {
      this.loadCategoriasLocal();
    }
    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(
        delay(100)
      )
      .subscribe(banner => { this.loadCategorias(); });


  }

  private actualizarInstruccionesPagos() {
    // Jalamos los textos traducidos desde el JSON en milisegundos
    const title = this.translate.instant('CATEGORY.TITLE');
    const subtitle = this.translate.instant('CATEGORY.SUBTITLE');
    const item1 = this.translate.instant('CATEGORY.ITEM_1');
    const item2 = this.translate.instant('CATEGORY.ITEM_2');
    const item3 = this.translate.instant('CATEGORY.ITEM_3');
    const item4 = this.translate.instant('CATEGORY.ITEM_4');
    const item5 = this.translate.instant('CATEGORY.ITEM_5');

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
    this.imgSubs.unsubscribe();
  }


  loadCategorias() {
    this.cargando = true;
    this.categoriaService.cargarCategorias().subscribe(
      categorias => {
        this.cargando = false;
        this.categorias = categorias;
      }
    )

  }
  loadCategoriasLocal() {
    this.cargando = true;
    this.categoriaService.getCategoriaByLocal(this.user.local).subscribe(
      categorias => {
        this.cargando = false;
        this.categorias = categorias;
      }
    )

  }

  cargar_iconos() {
    this._iconoService.getIcons().subscribe(
      resp => {
        this.listIcons = resp;
        console.log(this.listIcons.iconos)

      }
    )
  }

  guardarCambios(categoria: Categoria) {
    this.categoriaService.actualizarCategoria(categoria)
      .subscribe(resp => {
        Swal.fire('Actualizado', categoria.nombre.es, 'success')
      })

  }


  eliminarCategoria(categoria: Categoria) {
    this.categoriaService.borrarCategoria(categoria._id)
      .subscribe(resp => {
        this.ngOnInit();
        Swal.fire('Borrado', categoria.nombre.es, 'success')
      })

  }

  public PageSize(): void {
    this.query = '';
    this.ngOnInit();
    // this.router.navigateByUrl('/productos')
  }

  handleSearchEvent(event: any) {
    if (event.categorias) {
      this.categorias = event.categorias;
    }
  }

  desactivar(id) {
    this.categoriaService.desactivar(id).subscribe(
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
    this.categoriaService.activar(id).subscribe(
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

  onEditProject(categoria: Categoria) {
    this.categoriaSeleccionado = categoria;
  }

  openEditModal(): void {
    this.categoriaSeleccionado = null;
  }

  onCloseModal(): void {
    this.categoriaSeleccionado = null;
  }

  onClose() {
    this.ngOnInit();
  }

}
