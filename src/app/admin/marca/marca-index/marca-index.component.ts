import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { BusquedasService } from '../../../services/busquedas.service';
import { Marca } from '../../../models/marca.model';
import { MarcaService } from '../../../services/marca.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-marca-index',
  templateUrl: './marca-index.component.html',
  styleUrls: ['./marca-index.component.css']
})
export class MarcaIndexComponent implements OnInit {
  public marcas: Marca[] =[];
  public marca: Marca;
  public cargando: boolean = true;

  public totalMarcas: number = 0;
  public desde: number = 0;

  p: number = 1;
  count: number = 8;

  public imgSubs: Subscription;

  query:string ='';
      searchForm!:FormGroup;
      currentPage = 1;
      collecion='marcas';

  constructor(
    private marcaService: MarcaService,
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
    this.marcaService.cargarMarcas().subscribe(
      marcas => {
        this.cargando = false;
        this.marcas = marcas;
      }
    )

  }
  cambiarPagina(valor: number){
    this.desde += valor;

    if(this.desde < 0){
      this.desde = 0
    }else if( this.desde > this.totalMarcas){
      this.desde -= valor;
    }

    this.loadMarcas();


  }

  guardarCambios(marca: Marca){
    this.marcaService.actualizarMarca(marca)
    .subscribe( resp => {
      Swal.fire('Actualizado', marca.nombre,  'success')
    })

  }


  eliminarMarca(marca: Marca){
    this.marcaService.borrarMarca(marca._id)
    .subscribe( resp => {
      this.loadMarcas();
      Swal.fire('Borrado', marca.nombre, 'success')
    })

  }



  public PageSize(): void {
    this.query = '';
    this.loadMarcas();
    // this.router.navigateByUrl('/productos')
  }

  handleSearchEvent(event: any) {
    if (event.marcas) {
      this.marcas = event.marcas;
    }
  }

}
