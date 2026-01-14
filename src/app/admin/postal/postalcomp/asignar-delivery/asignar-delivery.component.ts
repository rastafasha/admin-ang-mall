import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { Venta } from 'src/app/models/ventas.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { VentaService } from 'src/app/services/venta.service';

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
  drivers:Usuario;
  msm_error = false;
  listaparaenviar:any;
  
   public page;
  public pageSize = 15;
  public count_cat;

  constructor(
    private ventaService: VentaService,
    private userService: UsuarioService,
  ) { }

  ngOnInit(): void {
     // obtengo el usuario
    let USER = localStorage.getItem("user");
    this.user = JSON.parse(USER ? USER: '');
    this.filtrarVentas();
    this.getDrivers();
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

  getDrivers(){
    this.userService.getDriversLocal(this.user.local).subscribe((resp:any) =>{
       this.usuarios = resp;
      //  console.log('drivers:', this.usuarios)

      // Filtrar usuarios con rol CHOFER o DRIVER
      // const usuariosFiltrados = this.usuarios.filter((usuario: any) => 
      //   usuario.role === 'CHOFER'
      // );
      
      // Filtrar por local (manejar tanto objeto._id como string directo)
      this.drivers = this.usuarios.filter((usuario: any) => {
        const userLocal = usuario.local?._id || usuario.local;
        const currentLocal = this.user.local?._id || this.user.local;
        // console.log('DRIVERS FILTRADOS:', this.drivers)
        return userLocal === currentLocal;
      });

      // console.log('DRIVERS FILTRADOS:', this.drivers)
    })
  }

}
