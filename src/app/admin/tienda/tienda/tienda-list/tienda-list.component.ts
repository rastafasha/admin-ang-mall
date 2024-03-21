import { Component, OnInit } from '@angular/core';
import { Subscription, delay } from 'rxjs';
import { Marca } from 'src/app/models/marca.model';
import { Tienda } from 'src/app/models/tienda.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { MarcaService } from 'src/app/services/marca.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { TiendaService } from 'src/app/services/tienda.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tienda-list',
  templateUrl: './tienda-list.component.html',
  styleUrls: ['./tienda-list.component.css']
})
export class TiendaListComponent implements OnInit {

  public tiendas: Tienda[] =[];
  public cargando: boolean = true;

  public totalTiendas: number = 0;
  public desde: number = 0;

  p: number = 1;
  count: number = 8;

  public imgSubs: Subscription;

  constructor(
    private tiendaService: TiendaService,
    private modalImagenService: ModalImagenService,
    private busquedaService: BusquedasService,
  ) { }

  ngOnInit(): void {

    this.loadMarcas();
    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe(
      delay(100)
    )
    .subscribe(banner => { this.loadMarcas();});
  }

  ngOnDestroy(){
    this.imgSubs.unsubscribe();
  }

  loadMarcas(){
    this.cargando = true;
    this.tiendaService.cargarTiendas().subscribe(
      (resp:any) => {
        this.cargando = false;
        this.tiendas = resp;
        console.log(this.tiendas);
      }
    )

  }
  cambiarPagina(valor: number){
    this.desde += valor;

    if(this.desde < 0){
      this.desde = 0
    }else if( this.desde > this.totalTiendas){
      this.desde -= valor;
    }

    this.loadMarcas();


  }

  guardarCambios(tienda: Tienda){
    this.tiendaService.actualizarTienda(tienda)
    .subscribe( (resp:any) => {
      Swal.fire('Actualizado', tienda.nombre,  'success')
    })

  }


  eliminarMarca(tienda: Marca){
    this.tiendaService.borrarTienda(tienda._id)
    .subscribe( (resp:any) => {
      this.loadMarcas();
      Swal.fire('Borrado', tienda.nombre, 'success')
    })

  }



  buscar(termino: string){

    if(termino.length === 0){
      return this.loadMarcas();
    }

    this.busquedaService.buscar('tiendas', termino)
    .subscribe( resultados => {
      resultados;
    })
  }

}
