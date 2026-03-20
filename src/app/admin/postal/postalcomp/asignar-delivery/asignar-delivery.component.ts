import { Component, OnInit } from '@angular/core';
import { Asignacion } from 'src/app/models/asignaciondelivery.model';
import { Driver } from 'src/app/models/driverp.model';
import { Tienda } from 'src/app/models/tienda.model';
import { Venta } from 'src/app/models/ventas.model';
import { AsignardeliveryService } from 'src/app/services/asignardelivery.service';
import { DriverpService } from 'src/app/services/driverp.service';
import { TiendaService } from 'src/app/services/tienda.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { VentaService } from 'src/app/services/venta.service';
// import { Modal } from 'bootstrap';

@Component({
  selector: 'app-asignar-delivery',
  templateUrl: './asignar-delivery.component.html',
  styleUrls: ['./asignar-delivery.component.css']
})
export class AsignarDeliveryComponent implements OnInit {

  public ventas: Array<any> = [];
  public ventasFiltradas: Array<any> = [];
  user: any;
  usuarios: any;
  drivers: Driver;
  driver: Driver;
  tienda: Tienda;
  tiendaId: string;
  venta: Venta;
  msm_error = false;
  listaparaenviar: Array<any> = [];
  asignaciones: Asignacion;

  showModal: boolean = false;

  public page;
  public pageSize = 15;
  public count_cat;

  public last_sellers: Array<any> = [];

  constructor(
    private ventaService: VentaService,
    private asignacionDService: AsignardeliveryService,
    private userService: UsuarioService,
    private driverService: DriverpService,
    private tiendaService: TiendaService,
  ) { }

  ngOnInit(): void {
    // obtengo el usuario
    let USER = localStorage.getItem("user");
    this.user = JSON.parse(USER ? USER : '');
    this.getAsignaciones();

    this.filtrarVentas();
    if (this.user.role === 'SUPERADMIN') {
      this.getDrivers();
    } else {
      this.tiendaId;
      this.getDriversLocal();
    }
  }

  PageSize() {
    this.filtrarVentas();
    this.getAsignaciones();
    if (this.user.role === 'SUPERADMIN') {
      this.getDrivers();
    }
    if (this.user.role === 'ADMIN') {
      this.getDriversLocal();
    }
  }

  filtrarVentas() {

    if (this.user.role === 'SUPERADMIN') {
      this.ventaService.init_data_admin().subscribe(
        response => {

          if (this.user.role === 'SUPERADMIN') {
            this.ventas = response.data;
            this.ventasFiltradas = response.data;
            const paraenviar = this.ventas.filter((venta: any) => venta.estado === 'Enviado');

            this.listaparaenviar = paraenviar
            // this.count_cat = this.ventas.length;
          }
          else {
            this.ventas = response.data;
            // this.ventasFiltradas = response.data;
            this.ventasFiltradas = this.ventas.filter(item => item.user?.local === this.user.local)
            const paraenviar = this.ventas.filter((venta: any) => venta.estado === 'Enviado');

            this.listaparaenviar = paraenviar

          }

          this.page = 1;

        }
      );
    }
    if (this.user.role === 'ADMIN') {
      this.ventaService.init_data_adminLocal(this.user.local).subscribe(
        (response:any) => {

          
          if (this.user.role === 'ADMIN') {
            this.ventas = response.data;
            
            this.ventasFiltradas = response.data;
            const paraenviar = this.ventas.filter((venta: any) => venta.estado === 'Enviado');

            this.listaparaenviar = paraenviar
          }
          

          this.page = 1;

        }
      );
    }

  }


  getDriversLocal() {
    this.driverService.getByLocalId(this.user.local).subscribe((resp: any) => {
      this.drivers = resp;
      this.tienda = resp.tienda;
    })
  }

  getDrivers() {
    this.driverService.gets().subscribe((resp: any) => {
      this.drivers = resp;
    })
  }

  getAsignaciones() {
    this.asignacionDService.getByTiendaId(this.user.local).subscribe((resp: any) => {
      this.asignaciones = resp;

    })
  }


  asignarDelivery(driver: string, venta: any) {
    const data = {
      venta: venta._id,
      driver: driver,
      tienda: this.user.local,
      status: 'Asignado'
    };
    // console.log(data)
    this.asignacionDService.create(data).subscribe(
      (resp: any) => {
        console.log('Asignación creada:', resp);
        // Aquí puedes agregar lógica adicional, como mostrar un mensaje de éxito o actualizar la lista de asignaciones

        //cerramos el modal
        this.closeModal(venta);
        this.ngOnInit();
      },
      error => {
        console.error('Error al crear la asignación:', error);
        // Aquí puedes manejar el error, como mostrar un mensaje de error al usuario
      }
    );
  }
  openModal(venta: any) {
    this.showModal = true;
    const modal = document.querySelector('#asignar-' + venta._id) as HTMLElement;
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      document.body.classList.add('modal-open');
      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop fade show';
      document.body.appendChild(backdrop);
    }
  }

  closeModal(venta: any) {
    this.showModal = false;
    const modal = document.querySelector('#asignar-' + venta._id) as HTMLElement;
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
      const backdrop = document.querySelector('.modal-backdrop') as HTMLElement;
      if (backdrop) {
        document.body.removeChild(backdrop);
      }
    }
  }


}
