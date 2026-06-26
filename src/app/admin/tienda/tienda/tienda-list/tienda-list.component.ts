import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, delay } from 'rxjs';
import { Marca } from 'src/app/models/marca.model';
import { Tienda } from 'src/app/models/tienda.model';
import { Usuario } from 'src/app/models/usuario.model';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { TiendaService } from 'src/app/services/tienda.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tienda-list',
  standalone: false,
  templateUrl: './tienda-list.component.html',
  styleUrls: ['./tienda-list.component.css']
})
export class TiendaListComponent implements OnInit, OnDestroy  {

  public tiendas: Tienda;
  public tienda: Tienda;
  public cargando: boolean = true;

  public totalTiendas: number = 0;
  public desde: number = 0;

  p: number = 1;
  count: number = 8;

  public imgSubs: Subscription;

  query: string = '';
  searchForm!: FormGroup;
  currentPage = 1;
  collecion = 'tiendas';
  user: Usuario;
  tiendaSeleccionado: Tienda;
  public info: string = '';
  private langSubscription!: Subscription;

  constructor(
    private tiendaService: TiendaService,
    private modalImagenService: ModalImagenService,
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    let USER = localStorage.getItem("user");
    this.user = USER ? JSON.parse(USER) : null;
    this.user = JSON.parse(USER ? USER : '');
    
     // 🟢 1. CARGA INICIAL DE LAS INSTRUCCIONES (Garantiza que la info no empiece vacía)
    this.translate.get('STORE.TITLE').subscribe(() => {
      this.actualizarInstruccionesPagos();
    });

    // 🟢 2. ESCUCHA SI CAMBIAN EL IDIOMA DESPUÉS (Mantiene tu lógica actual)
    this.langSubscription = this.translate.onLangChange.subscribe(() => {
      this.actualizarInstruccionesPagos();
    });


    if (this.user.role === 'SUPERADMIN') {
      this.loadTiendas();
    }

    if (this.user.role !== 'SUPERADMIN') {
      this.loadTiendasById();
    }

    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(
        delay(100)
      )
      .subscribe(banner => { this.loadTiendas(); });
      
   
  }

  private actualizarInstruccionesPagos() {
    // Jalamos los textos traducidos desde el JSON en milisegundos
    const title = this.translate.instant('STORE.TITLE');
    const subtitle = this.translate.instant('STORE.SUBTITLE');
    const item1 = this.translate.instant('STORE.ITEM_1');

    // Inyectamos el bloque HTML bilingüe estable en la propiedad
    this.info = `
    <h2>${title}</h2>
    <p>${subtitle}</p>
    <ul>
      <li>${item1}</li>
    </ul>
  `;
  }

  ngOnDestroy(): void {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
    this.imgSubs.unsubscribe();
  }


 
  loadTiendas() {
    this.cargando = true;
    this.tiendaService.cargarTiendas().subscribe(
      (resp: any) => {
        this.cargando = false;
        this.tiendas = resp;
        // console.log(this.tiendas);
      }
    )

  }
  loadTiendasById() {
    this.cargando = true;
    this.tiendaService.getTiendasByUserId(this.user.uid).subscribe(
      resp => {
        this.cargando = false;
        this.tiendas = resp;
      }
    )

  }
  cambiarPagina(valor: number) {
    this.desde += valor;

    if (this.desde < 0) {
      this.desde = 0
    } else if (this.desde > this.totalTiendas) {
      this.desde -= valor;
    }

    // this.loadTiendas();
    if (this.user.role === 'SUPERADMIN') {
      this.loadTiendas();
    }

    if (this.user.role === 'ADMIN') {
      this.loadTiendasById();
    }


  }

  guardarCambios(tienda: Tienda) {
    this.tiendaService.actualizarTienda(tienda)
      .subscribe((resp: any) => {
        Swal.fire('Actualizado', tienda.nombre, 'success')
      })

  }
  desactivar(id) {
    this.tiendaService.desactivar(id).subscribe((resp: any) => {
      this.ngOnInit();
    })
  }

  activar(id) {
    this.tiendaService.activar(id).subscribe((resp: any) => {
      this.ngOnInit();
    })
  }



  eliminarTienda(tienda: Marca) {
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
        this.tiendaService.borrarTienda(tienda._id)
          .subscribe(resp => {
            if (this.user.role === 'SUPERADMIN') {
              this.loadTiendas();
            }

            if (this.user.role === 'ADMIN') {
              this.loadTiendasById();
            }
          })
        Swal.fire('Borrado!', 'El Archivo fue borrado.', 'success');
      }
    });
  }


  public PageSize(): void {
    this.query = '';
    if (this.user.role === 'SUPERADMIN') {
      this.loadTiendas();
    }
    if (this.user.role === 'ADMIN') {
      this.loadTiendasById();
    }
  }

  handleSearchEvent(event: any) {
    if (event.tiendas) {
      this.tiendas = event.tiendas;
    }
  }

  onEditProject(tienda: Tienda) {
    this.tiendaSeleccionado = tienda;
  }

  openEditModal(): void {
    this.tiendaSeleccionado = null;
  }

  onCloseModal(): void {
    this.tiendaSeleccionado = null;
  }

  onClose() { }

}
