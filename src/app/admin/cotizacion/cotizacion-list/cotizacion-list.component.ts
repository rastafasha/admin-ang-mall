import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, delay } from 'rxjs';
import { Presupuesto } from 'src/app/models/presupuesto';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { PresupuestoService } from 'src/app/services/presupuesto.service';

@Component({
  selector: 'app-cotizacion-list',
  standalone:false,
  templateUrl: './cotizacion-list.component.html',
  styleUrl: './cotizacion-list.component.css'
})
export class CotizacionListComponent {

  public presupuestos: Presupuesto[] = [];
  public presupuesto: Presupuesto;
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
  presupuestoSeleccionado: Presupuesto;
  public info: string = '';
  private langSubscription!: Subscription;
  

  constructor(
    private presupuestoService: PresupuestoService,
    private modalImagenService: ModalImagenService,
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    let USER = localStorage.getItem("user");
    this.user = JSON.parse(USER ? USER : '');

    // 🟢 1. CARGA INICIAL DE LAS INSTRUCCIONES (Garantiza que la info no empiece vacía)
    this.translate.get('PRESUPUESTO.TITLE').subscribe(() => {
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
    this.presupuestoService.list().subscribe(
      (resp:any) => {
        this.cargando = false;
        this.presupuestos = resp;
      }
    )

  }
  loadCategoriasLocal() {
    this.cargando = true;
    this.presupuestoService.getByTiendaId(this.user.local).subscribe(
      (resp:any) => {
        this.cargando = false;
        this.presupuestos = resp;
      }
    )

  }

  
  

  // eliminarCategoria(categoria: Categoria) {
  //   this.presupuestoService.borrarCategoria(categoria._id)
  //     .subscribe(resp => {
  //       this.ngOnInit();
  //       Swal.fire('Borrado', categoria.nombre.es, 'success')
  //     })

  // }

  public PageSize(): void {
    this.query = '';
    this.ngOnInit();
    // this.router.navigateByUrl('/productos')
  }

  handleSearchEvent(event: any) {
    if (event.presupuestos) {
      this.presupuestos = event.presupuestos;
    }
  }


  onEditProject(presupuesto: Presupuesto) {
    this.presupuestoSeleccionado = presupuesto;
  }

  openEditModal(): void {
    this.presupuestoSeleccionado = null;
  }

  onCloseModal(): void {
    this.presupuestoSeleccionado = null;
  }

  onClose() {
    this.ngOnInit();
  }

}
