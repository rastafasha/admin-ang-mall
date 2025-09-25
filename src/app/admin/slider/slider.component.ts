import { Component,  OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { BusquedasService } from '../../services/busquedas.service';
import { Slider } from '../../models/slider.model';
import { SliderService } from '../../services/slider.service';
import { ModalImagenService } from '../../services/modal-imagen.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent implements OnInit {

  public sliders: Slider[] =[];
  public cargando: boolean = true;

  public desde: number = 0;
  slider: Slider;

  p: number = 1;
  count: number = 8;

  public imgSubs: Subscription;

  query:string ='';
    searchForm!:FormGroup;
    currentPage = 1;
    collecion='sliders';
    // public slider : any = {};

  constructor(
    private sliderService: SliderService,
    private modalImagenService: ModalImagenService,
    private busquedaService: BusquedasService,
  ) { }

  ngOnInit(): void {

    this.loadSliders();
    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe(
      delay(100)
    )
    .subscribe(img => { this.loadSliders();});
  }

  ngOnDestroy(){
    this.imgSubs.unsubscribe();
  }

  loadSliders(){
    this.cargando = true;
    this.sliderService.getSliders().subscribe(
      sliders => {
        this.cargando = false;
        this.sliders = sliders;
        console.log(this.sliders);
      }
    )

  }

  guardarCambios(slider: Slider){
    this.sliderService.actualizarSlider(slider)
    .subscribe( resp => {
      Swal.fire('Actualizado', slider.first_title,  'success')
    })

  }


  eliminarSlider(slider: Slider){
    this.sliderService.borrarSlider(slider._id)
    .subscribe( resp => {
      this.loadSliders();
      Swal.fire('Borrado', this.slider.first_title, 'success')
    })

  }



  // buscar(termino: string){

  //   if(termino.length === 0){
  //     return this.loadSliders();
  //   }

  //   this.busquedaService.buscar('sliders', termino)
  //   .subscribe( resultados => {
  //     resultados;
  //   })
  // }

  public PageSize(): void {
    this.query = '';
    this.loadSliders();
    // this.router.navigateByUrl('/productos')
  }

  handleSearchEvent(event: any) {
    if (event.sliders) {
      this.sliders = event.sliders;
    }
  }

}
