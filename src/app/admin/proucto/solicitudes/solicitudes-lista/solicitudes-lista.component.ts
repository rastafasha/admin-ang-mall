import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Solicitud } from 'src/app/models/solicitud.model';
import { SolicitudService } from 'src/app/services/solicitud.service';
import { TiendaService } from 'src/app/services/tienda.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-solicitudes-lista',
  standalone: false,
  templateUrl: './solicitudes-lista.component.html',
  styleUrl: './solicitudes-lista.component.css'
})
export class SolicitudesListaComponent {
  solicitudes: Solicitud[] = [];
  p: number = 1;
  count: number = 8;
  user: any;
  cargando: boolean = true;
  query: string = '';
  solicitudSelected: Solicitud | null = null;
  option_selectedd: number = 1;
  solicitud_selectedd: any = 1;
  public info: string = '';
  private langSubscription!: Subscription;

  constructor(
    private solicitudService: SolicitudService,
    private tiendaService: TiendaService,
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    let USER = localStorage.getItem("user");
    this.user = JSON.parse(USER ? USER : '');
    // 🟢 1. CARGA INICIAL DE LAS INSTRUCCIONES (Garantiza que la info no empiece vacía)
    this.translate.get('RESERVATION.TITLE').subscribe(() => {
      this.actualizarInstruccionesPagos();
    });

    // 🟢 2. ESCUCHA SI CAMBIAN EL IDIOMA DESPUÉS (Mantiene tu lógica actual)
    this.langSubscription = this.translate.onLangChange.subscribe(() => {
      this.actualizarInstruccionesPagos();
    });

    if (this.user.role === 'SUPERADMIN') {
      this.loadReservaciones();
    }
    if (this.user.role === 'ADMIN' || this.user.role === 'VENTAS') {
      this.getReservacionesByLocal();
      this.getTienda();
    }

  }

  private actualizarInstruccionesPagos() {
    // Jalamos los textos traducidos desde el JSON en milisegundos
    const title = this.translate.instant('RESERVATION.TITLE');
    const subtitle = this.translate.instant('RESERVATION.SUBTITLE');
    const item1 = this.translate.instant('RESERVATION.ITEM_1');
    const item2 = this.translate.instant('RESERVATION.ITEM_2');
    const item3 = this.translate.instant('RESERVATION.ITEM_3');
    const item4 = this.translate.instant('RESERVATION.ITEM_4');

    // Inyectamos el bloque HTML bilingüe estable en la propiedad
    this.info = `
      <h2>${title}</h2>
      <p>${subtitle}</p>
      <ul>
        <li>${item1}</li>
        <li>${item2}</li>
        <li>${item3}</li>
        <li>${item4}</li>
      </ul>
    `;
  }

  ngOnDestroy(): void {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }


  loadReservaciones() {
    this.cargando = true;
    this.solicitudService.list().subscribe(
      (resp: any) => {
        this.cargando = false;
        this.solicitudes = resp;
      }
    )

  }


  getReservacionesByLocal() {
    this.cargando = true;
    this.solicitudService.getByTiendaId(this.user.local).subscribe(
      (resp: any) => {
        this.solicitudes = resp;
        this.cargando = false;
      }
    )
  }

  getTienda() {
    this.tiendaService.getTiendaById(this.user.local).subscribe((resp: any) => {
      // this.tienda_moneda = resp.moneda;
    })
  }

  cambiarStatus(data: any) {
    const status = data.status;
    const id = data._id;

    // 1. Caso: RECHAZADO (Pide motivo)
    if (status === 'Cancelada') {
      Swal.fire({
        title: 'Motivo del Rechazo',
        input: 'text',
        inputPlaceholder: 'Ej: Capture borroso, monto incompleto...',
        showCancelButton: true,
        confirmButtonText: 'Rechazar y Notificar',
        confirmButtonColor: '#d33', // Rojo para peligro
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => {
          if (!value) return '¡Debes escribir un motivo para el usuario!';
          return null;
        }
      }).then((result) => {
        if (result.isConfirmed) {
          this.ejecutarUpdateStatus(id, status, result.value);
        } else {
          this.ngOnInit(); // Revierte el select si cancela
        }
      });

      // 2. Caso: APROBADO (Confirmación de seguridad)
    } else if (status === 'Confirmada') {
      Swal.fire({
        title: '¿Confirmar Reservación?',
        text: `¿Estás seguro de marcar como APROBADO la Reservación de ${data.first_name}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, Aprobar',
        confirmButtonColor: '#198754', // Verde para éxito
        cancelButtonText: 'No, revisar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.ejecutarUpdateStatus(id, status);
        } else {
          this.ngOnInit(); // Revierte el select si se arrepiente
        }
      });

    } else {
      // 3. Caso: PENDIENTE (Cambio directo)
      this.ejecutarUpdateStatus(id, status);
    }
  }


  // Función auxiliar para no repetir código del subscribe
  private ejecutarUpdateStatus(id: string, status: string, observaciones: string = '') {
    const payload = {
      _id: id,
      status: status,
      local: this.user.local,
      updatedAt: Date.now(),
      observaciones: observaciones // Esto llegará a tu backend para el mensaje del Push/Toastr
    };



    // this.solicitudService.editSolicitud(payload,).subscribe({
    //   next: (resp) => {
    //     Swal.fire({
    //       position: 'top-end',
    //       icon: 'success',
    //       title: status === 'Confirmada' ? '✅ Reservación Aprobado' : '❌ Reservación Rechazado',
    //       color: 'gray',
    //       showConfirmButton: false,
    //       timer: 1500,
    //     });
    //     this.ngOnInit();
    //   },
    //   error: (err) => {
    //     Swal.fire('Error', 'No se pudo actualizar el pago', 'error');
    //     this.ngOnInit();
    //   }
    // });
  }

  eliminarSolicitud(solicitud: Solicitud) {
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
        this.solicitudService.deleteSolicitud(solicitud._id)
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
    // this.router.navigateByUrl('/productos')
  }
  handleSearchEvent(event: any) {
    if (event.solicitudes) {
      this.solicitudes = event.solicitudes;
    }
  }

  onViewPedido(solicitud: Solicitud) {
    this.solicitudSelected = solicitud;
  }


  onCloseModal(): void {
    this.solicitudSelected = null;
  }

  onClose() { }



}
