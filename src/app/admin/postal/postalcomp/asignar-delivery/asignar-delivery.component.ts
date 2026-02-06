import { Component, OnInit } from '@angular/core';
import { Asignacion } from 'src/app/models/asignaciondelivery.model';
import { Driver } from 'src/app/models/driverp.model';
import { Tienda } from 'src/app/models/tienda.model';
import { Venta } from 'src/app/models/ventas.model';
import { AsignardeliveryService } from 'src/app/services/asignardelivery.service';
import { DriverpService } from 'src/app/services/driverp.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { VentaService } from 'src/app/services/venta.service';
// import { Modal } from 'bootstrap';

@Component({
  selector: 'app-asignar-delivery',
  templateUrl: './asignar-delivery.component.html',
  styleUrls: ['./asignar-delivery.component.css']
})
export class AsignarDeliveryComponent implements OnInit {

  public ventas : Array<any> =[];
    public ventasFiltradas : Array<any> = [];
  user:any;
  usuarios:any;
  drivers:Driver;
  driver:Driver;
  tienda:Tienda;
  tiendaId:string;
  venta:Venta;
  msm_error = false;
  listaparaenviar:Array<any> =[];
  asignaciones:Asignacion;

  showModal:boolean = false;
  
   public page;
  public pageSize = 15;
  public count_cat;

  constructor(
    private ventaService: VentaService,
    private asignacionDService: AsignardeliveryService,
    private userService: UsuarioService,
    private driverService: DriverpService,
  ) { }

  ngOnInit(): void {
     // obtengo el usuario
    let USER = localStorage.getItem("user");
    this.user = JSON.parse(USER ? USER: '');
    this.tiendaId = this.user.local;
    console.log('tiendaId',this.tiendaId);
    
    this.filtrarVentas();
    this.getAsignaciones();

    if(this.user.role==='SUPERADMIN' ){
      this.getDrivers();
    }else{
      this.tiendaId;
      this.getDriversLocal();
    }
  }

  filtrarVentas(){
     this.ventaService.init_data_admin().subscribe(
      response => {
        
        if(this.user.role==='SUPERADMIN'){
          this.ventas = response.data;
          this.ventasFiltradas = response.data;
          const paraenviar = this.ventas.filter((venta: any) => venta.estado === 'Enviado');

          this.listaparaenviar = paraenviar
          // this.count_cat = this.ventas.length;
        }
        if(this.user.role==='ADMIN'){
          this.ventas = response.data;
          this.ventasFiltradas = response.data;
          // this.count_cat = this.ventas.length;
          const paraenviar = this.ventas.filter((venta: any) => venta.estado === 'Enviado');

          this.listaparaenviar = paraenviar
          // console.log('VENTASf',this.ventasFiltradas);
          // console.log('VENTASE',paraenviar);
        }
        else{
          this.ventas = response.data;
          // this.ventasFiltradas = response.data;
          this.ventasFiltradas = this.ventas.filter(item => item.user?.local===this.user.local)
          const paraenviar = this.ventas.filter((venta: any) => venta.estado === 'Enviado');

          this.listaparaenviar = paraenviar
          
        }
        
        this.page = 1;

      }
    );
  }

  getDriversLocal(){
    this.driverService.getByLocalId(this.tiendaId).subscribe((resp:any) =>{
       this.drivers = resp;
       console.log('drivers Local:', this.drivers)
    })
  }

  getDrivers(){
    this.driverService.gets().subscribe((resp:any) =>{
       this.drivers = resp;
       console.log('drivers:', this.drivers)
    })
  }

  getAsignaciones(){
    this.asignacionDService.getByTiendaId(this.user.local).subscribe((resp:any) =>{
      // console.log('asignaciones:', resp)
      this.asignaciones = resp;
      
    })
  }
  

  asignarDelivery(driver:string, venta:any){
    const data = {
      venta: venta._id,
      driver: driver,
      tienda: this.tiendaId,
      status: 'Asignado'
    };
    // console.log(data)
    this.asignacionDService.create(data).subscribe(
      (resp:any) => {
        console.log('Asignación creada:', resp);
        // Aquí puedes agregar lógica adicional, como mostrar un mensaje de éxito o actualizar la lista de asignaciones
        
        //cerramos el modal
       this.closeModal();
        this.ngOnInit();
      },
      error => {
        console.error('Error al crear la asignación:', error);
        // Aquí puedes manejar el error, como mostrar un mensaje de error al usuario
      }
    );
  } 
  openModal() {
    this.showModal = true;
     const modal = document.querySelector('#asignar-'+this.venta._id) as HTMLElement;
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      document.body.classList.add('modal-open');
      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop fade show';
      document.body.appendChild(backdrop);
    }
  }

  closeModal() {
    this.showModal = false;
    const modal = document.querySelector('#asignar-'+this.venta._id) as HTMLElement;
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
