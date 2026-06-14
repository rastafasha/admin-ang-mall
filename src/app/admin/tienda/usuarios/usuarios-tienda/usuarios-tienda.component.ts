import { Component, OnDestroy, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Usuario } from 'src/app/models/usuario.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-usuarios-tienda',
  standalone: false,
  templateUrl: './usuarios-tienda.component.html',
  styleUrls: ['./usuarios-tienda.component.css']
})
export class UsuariosTiendaComponent implements OnInit, OnDestroy {

  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];
  public tiendausersTemp: Usuario[] = [];

  public desde: number = 0;
  public cargando: boolean = true;
  public user: any;
  public localId: string;
  public role: any;

  public imgSubs: Subscription;
  p: number = 1;
  count: number = 8;

  roles: string[];

  query: string = '';
  searchForm!: FormGroup;
  currentPage = 1;
  collecion = 'usuarios';
  public usuario: any = {};

  public info: string = '';
  private langSubscription!: Subscription;

  option_selectedd: number = 1;
      solicitud_selectedd: any = 1;

  constructor(
    private usuarioService: UsuarioService,
    private busquedaService: BusquedasService,
    private modalImagenService: ModalImagenService,
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    let USER = localStorage.getItem("user");
    this.user = JSON.parse(USER ? USER : '');
     // 🟢 1. CARGA INICIAL DE LAS INSTRUCCIONES (Garantiza que la info no empiece vacía)
    this.translate.get('USERS_STORE.TITLE').subscribe(() => {
      this.actualizarInstruccionesPagos();
    });

    // 🟢 2. ESCUCHA SI CAMBIAN EL IDIOMA DESPUÉS (Mantiene tu lógica actual)
    this.langSubscription = this.translate.onLangChange.subscribe(() => {
      this.actualizarInstruccionesPagos();
    });

    this.localId = this.user.local;
    this.role = this.user.role;
    this.loadUsuarios();

    
  }

  private actualizarInstruccionesPagos() {
    // Jalamos los textos traducidos desde el JSON en milisegundos
    const title = this.translate.instant('USERS_STORE.TITLE');
    const subtitle = this.translate.instant('USERS_STORE.SUBTITLE');
    const item1 = this.translate.instant('USERS_STORE.ITEM_1');
    const item2 = this.translate.instant('USERS_STORE.ITEM_2');
    const item3 = this.translate.instant('USERS_STORE.ITEM_3');

    // Inyectamos el bloque HTML bilingüe estable en la propiedad
    this.info = `
    <h2>${title}</h2>
    <p>${subtitle}</p>
    <ul>
      <li>${item1}</li>
      <li>${item2}</li>
      <li>${item3}</li>
    </ul>
  `;
  }

   ngOnDestroy(): void {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }



  loadUsuarios() {
    this.cargando = true;
    this.usuarioService.cargarEmployeesTienda(this.localId)
      .subscribe(
        local => {
          this.usuarios = local;
          this.cargando = false;
        }
      )
  }


  cambiarPagina(valor: number) {
    this.desde += valor;

    if (this.desde < 0) {
      this.desde = 0
    } else if (this.desde > this.totalUsuarios) {
      this.desde -= valor;
    }

    this.loadUsuarios();


  }

  public PageSize(): void {
    this.query = '';
    this.loadUsuarios();
    // this.router.navigateByUrl('/productos')
  }

  handleSearchEvent(event: any) {
    if (event.usuarios) {
      this.usuarios = event.usuarios;
    }
  }
  eliminarUsuario(usuario: any) {

    if (usuario.uid === this.usuarioService.uid) {
      return Swal.fire('Error', 'No se puede borrarse a si mismo', 'error');

    }

    Swal.fire({
      title: 'Borra usuario?',
      text: `Estar a punto de borrar a ${usuario.first_name}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.borrarUsuario(usuario).subscribe(
          resp => {
            this.loadUsuarios();
            Swal.fire(
              'Usuario Borrado',
              `El usuario ${usuario.first_name} ha sido borrado correctamente`,
              'success'
            );
          });
      }
    })
  }


  cambiarStatus(data: any) {
    let VALUE = data.role;
    // console.log(VALUE);

    this.usuarioService.upadateStatusRole(data, data.uid).subscribe(
      resp => {
        // console.log(resp);
        Swal.fire('Updated', `Client Status Updated successfully!`, 'success');
        this.loadUsuarios();
      }
    )
  }

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
