import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Reservacion } from 'src/app/models/reservacion.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { ReservacionService } from 'src/app/services/reservacion.service';
import { TiendaService } from 'src/app/services/tienda.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reservacion-list',
  standalone: false,
  templateUrl: './reservacion-list.component.html',
  styleUrl: './reservacion-list.component.css'
})
export class ReservacionListComponent {

  reservaciones: Reservacion[] = [];
  p: number = 1;
  count: number = 8;
  user: any;
  cargando: boolean = true;
  query: string = '';
  searchForm!: FormGroup;
  reservaSeleccionado:Reservacion | null = null;

  constructor(
    private reservacionService: ReservacionService,
    private tiendaService: TiendaService,
  ) { }

  ngOnInit(): void {
    let USER = localStorage.getItem("user");
    this.user = JSON.parse(USER ? USER : '');
    if (this.user.role === 'SUPERADMIN') {
      this.loadReservaciones();
    }
    if (this.user.role === 'ADMIN' || this.user.role === 'VENTAS') {
      this.getReservacionesByLocal();
      this.getTienda();
    }
  }


  loadReservaciones() {
    this.cargando = true;
    this.reservacionService.getReservaciones().subscribe(
      reservaciones => {
        this.cargando = false;
        this.reservaciones = reservaciones;
      }
    )

  }


  getReservacionesByLocal() {
    this.cargando = true;
    this.reservacionService.getReservacionByLocal(this.user.local).subscribe(
      (resp: any) => {
        this.reservaciones = resp;
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



    this.reservacionService.actualizarReservacion(payload).subscribe({
      next: (resp) => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: status === 'Confirmada' ? '✅ Reservación Aprobado' : '❌ Reservación Rechazado',
          color: 'gray',
          showConfirmButton: false,
          timer: 1500,
        });
        this.ngOnInit();
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudo actualizar el pago', 'error');
        this.ngOnInit();
      }
    });
  }

  eliminarTramsf(transf: Reservacion) {
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
        this.reservacionService.borrarReservacion(transf._id)
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
    if (event.reservaciones) {
      this.reservaciones = event.reservaciones;
    }
  }

  onViewPago(reserv: Reservacion) {
      this.reservaSeleccionado = reserv;
    }
  
  
    onCloseModal(): void {
      this.reservaSeleccionado = null;
    }
  
    onClose() { }


}
