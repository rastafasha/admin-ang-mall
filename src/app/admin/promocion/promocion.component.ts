import { Component,  OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { BusquedasService } from '../../services/busquedas.service';
import { Promocion } from '../../models/promocion.model';
import { PromocionService } from '../../services/promocion.service';
import { ModalImagenService } from '../../services/modal-imagen.service';
import { FormGroup } from '@angular/forms';

declare var jQuery:any;
declare var $:any;
@Component({
  selector: 'app-promocion',
  templateUrl: './promocion.component.html',
  styleUrls: ['./promocion.component.css']
})
export class PromocionComponent implements OnInit {

  public promocions: Promocion[] =[];
  public promocion: Promocion;
  public cargando: boolean = true;

  public desde: number = 0;

  p: number = 1;
  count: number = 8;

  public imgSubs: Subscription;
  public msm_error;

  query:string ='';
            searchForm!:FormGroup;
            currentPage = 1;
            collecion='promocions';

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

public PageSize(): void {
    this.query = '';
    this.loadPromocions();
    // this.router.navigateByUrl('/productos')
  }

  handleSearchEvent(event: any) {
    if (event.promocions) {
      this.promocions = event.promocions;
    }
  }

  desactivar(id){
    this.promocionService.desactivar(id).subscribe(
      response=>{
        $('#desactivar-'+id).modal('hide');
        $('.modal-backdrop').removeClass('show');
        this.loadPromocions();
      },
      error=>{
        this.msm_error = 'No se pudo desactivar el producto, vuelva a intenter.'
      }
    )
  }

  activar(id){
    this.promocionService.activar(id).subscribe(
      response=>{

        $('#activar-'+id).modal('hide');
        $('.modal-backdrop').removeClass('show');
        this.loadPromocions();
      },
      error=>{


        this.msm_error = 'No se pudo activar el producto, vuelva a intenter.'
      }
    )
  }

}
