import { Component,  OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { BusquedasService } from '../../services/busquedas.service';
import { Promocion } from '../../models/promocion.model';
import { PromocionService } from '../../services/promocion.service';
import { ModalImagenService } from '../../services/modal-imagen.service';

@Component({
  selector: 'app-promocion',
  templateUrl: './promocion.component.html',
  styleUrls: ['./promocion.component.css']
})
export class PromocionComponent implements OnInit {

  public promocions: Promocion[] =[];
  public cargando: boolean = true;

  public desde: number = 0;

  p: number = 1;
  count: number = 8;

  public imgSubs: Subscription;

  constructor(
    private promocionService: PromocionService,
    private modalImagenService: ModalImagenService,
    private busquedaService: BusquedasService,
  ) { }

  ngOnInit(): void {

    this.loadPromocions();
    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe(
      delay(100)
    )
    .subscribe(img => { this.loadPromocions();});
  }

  ngOnDestroy(){
    this.imgSubs.unsubscribe();
  }

  loadPromocions(){
    this.cargando = true;
    this.promocionService.cargarPromocions().subscribe(
      promocions => {
        this.cargando = false;
        this.promocions = promocions;
        console.log(this.promocions);
      }
    )

  }

  guardarCambios(promocion: Promocion){
    this.promocionService.actualizarPromocion(promocion)
    .subscribe( resp => {
      Swal.fire('Actualizado', promocion.producto_title,  'success')
    })

  }


  eliminarPromocion(promocion: Promocion){
    this.promocionService.borrarPromocion(promocion._id)
    .subscribe( resp => {
      this.loadPromocions();
      Swal.fire('Borrado', promocion.producto_title, 'success')
    })

  }



  buscar(termino: string){

    if(termino.length === 0){
      return this.loadPromocions();
    }

    this.busquedaService.buscar('marcas', termino)
    .subscribe( resultados => {
      resultados;
    })
  }

}
