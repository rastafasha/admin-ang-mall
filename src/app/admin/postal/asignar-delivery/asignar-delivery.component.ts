import { Component, OnInit } from '@angular/core';
import { Asignacion } from 'src/app/models/asignaciondelivery.model';
import { Direccion } from 'src/app/models/direccion.model';
import { Driver } from 'src/app/models/driverp.model';
import { Pedido } from 'src/app/models/pedido.model';
import { Tienda } from 'src/app/models/tienda.model';
import { Venta } from 'src/app/models/ventas.model';
import { AsignardeliveryService } from 'src/app/services/asignardelivery.service';
import { DireccionService } from 'src/app/services/direccion.service';
import { DriverpService } from 'src/app/services/driverp.service';
import { PedidomenuService } from 'src/app/services/pedidomenu.service';
import { VentaService } from 'src/app/services/venta.service';
// import { Modal } from 'bootstrap';

@Component({
  selector: 'app-asignar-delivery',
  standalone:false,
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
  pedidos: Pedido[];
  msm_error = false;
  isLoading = false;
  listaparaenviar: Array<any> = [];
  asignaciones: Asignacion;

  showModal: boolean = false;
  ventaSelected:any;
  direccion:Direccion;

  public page;
  public pageSize = 7;
  p: number = 1;
  pp: number = 1;
  countp: number = 8;
  count: number = 8;
  public count_cat;

  public last_sellers: Array<any> = [];

  constructor(
    private ventaService: VentaService,
    private asignacionDService: AsignardeliveryService,
    private driverService: DriverpService,
    private pedidoService: PedidomenuService,
    public direccionService: DireccionService,
  ) { }

  ngOnInit(): void {
    // obtengo el usuario
    let USER = localStorage.getItem("user");
    this.user = JSON.parse(USER ? USER : '');
    this.getAsignaciones();
    this.getpedidos();
    this.filtrarVentas();

    if (this.user.role === 'SUPERADMIN') {
      this.getDrivers();

    } 
    if (this.user.role === 'ADMIN') {
      this.getDriversLocal();
    }
  }

  PageSize() {
    this.ngOnInit();
  }

  filtrarVentas() {

    if (this.user.role === 'SUPERADMIN') {
      this.ventaService.init_data_admin().subscribe(
        response => {

          this.ventas = response.data;
          this.ventasFiltradas = response.data;
          const paraenviar = this.ventas.filter((venta: any) => venta.estado === 'Enviado');

          this.listaparaenviar = paraenviar
          this.page = 1;

        }
      );
    }
    if (this.user.role === 'ADMIN') {
      this.ventaService.init_data_adminLocal(this.user.local).subscribe(
        (response:any) => {

          this.ventas = response.data;
          this.ventasFiltradas = response.data;
          const paraenviar = this.ventas.filter((venta: any) => venta.estado === 'Enviado');

          this.listaparaenviar = paraenviar
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

 getpedidos() {
  this.pedidoService.getByTiendaId(this.user.local).subscribe((resp: any) => {
    this.pedidos = resp;
    // console.log(this.pedidos);
    
    // Recorremos el arreglo de pedidos recibido
    this.pedidos.forEach((pedido: any) => {
      // Verificamos que el pedido tenga una dirección y que no sea null
      if (pedido.direccion) {
        this.getDireccion(pedido.direccion);
      }
    });
  });
}

// Modificamos la función para que reciba el ID por parámetro
getDireccion(idDireccion: string) {
  this.direccionService.get_direccion(idDireccion).subscribe((resp: any) => {
    // Aquí recibes la dirección individual de ese pedido
    // console.log('Dirección recibida:', resp);
    this.direccion = resp;
    
    // NOTA: Si necesitas guardar las direcciones, puedes asociarlas 
    // directamente al objeto del pedido correspondiente.
  });
}

  getAsignaciones() {
    this.isLoading = true;
    this.asignacionDService.getByTiendaId(this.user.local).subscribe((resp: any) => {
      this.asignaciones = resp;
      this.isLoading = false;

    })
  }


  asignarDeliveryconDriver(datos:{driver: string, venta: any}) {

    const data = {
      pedido: datos.venta._id,
      driver: datos.driver,
      tienda: this.user.local,
      status: 'Asignado'
    };
    // console.log(data)
    this.asignacionDService.create(data).subscribe(
      (resp: any) => {
        console.log('Asignación creada:', resp);
        // Aquí puedes agregar lógica adicional, como mostrar un mensaje de éxito o actualizar la lista de asignaciones

        //cerramos el modal
        this.ngOnInit();
      },
      error => {
        console.error('Error al crear la asignación:', error);
        // Aquí puedes manejar el error, como mostrar un mensaje de error al usuario
      }
    );
  }

  onViewVenta(venta: Venta) {
      this.ventaSelected = venta;
      // console.log(this.ventaSelected)
    }
  


  onCloseModal(): void {
    this.ventaSelected = null;
  }

  onClose() { }


}
