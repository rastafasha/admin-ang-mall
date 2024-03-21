import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { delay } from 'rxjs/operators';

import { BusquedasService } from '../../../services/busquedas.service';
import { Categoria } from '../../../models/categoria.model';
import { CategoriaService } from '../../../services/categoria.service';
import { Curso } from '../../../models/curso.model';
import { CursoService } from '../../../services/curso.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

declare var jQuery:any;
declare var $:any;
@Component({
  selector: 'app-curso-index',
  templateUrl: './curso-index.component.html',
  styleUrls: ['./curso-index.component.css']
})
export class CursoIndexComponent implements OnInit {

  public cursos: Curso[] =[];
  public curso: Curso;
  public categorias: Categoria[] =[];
  public cargando: boolean = true;

  public totalCursos: number = 0;
  public desde: number = 0;

  p: number = 1;
  count: number = 8;

  public imgSubs: Subscription;
  listIcons;

  public msm_error;

  constructor(
    private cursoService: CursoService,
    private categoriaService: CategoriaService,
    private modalImagenService: ModalImagenService,
    private busquedaService: BusquedasService,
    private _sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {

    this.loadCategorias();
    this.loadCursos();
    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe(
      delay(100)
    )
    .subscribe(img => { this.loadCursos();});
  }

  ngOnDestroy(){
    this.imgSubs.unsubscribe();
  }

  loadCursos(){
    this.cargando = true;
    this.cursoService.getCursos().subscribe(
      cursos => {
        this.cargando = false;
        this.cursos = cursos;
        console.log(this.cursos);
      }
    )

  }
  loadCategorias(){
    this.cargando = true;
    this.categoriaService.cargarCategorias().subscribe(
      categorias => {
        this.categorias = categorias;
      }
    )

  }




  eliminarCurso(_id: string){
    this.cursoService.borrarCurso(this.curso._id)
    .subscribe( resp => {
      this.loadCategorias();
      Swal.fire('Borrado', this.curso.titulo, 'success')
    })

  }

  buscar(termino: string){

    if(termino.length === 0){
      return this.loadCategorias();
    }

    this.busquedaService.buscar('cursos', termino)
    .subscribe( resultados => {
      resultados;
    })
  }




  desactivar(id){
    this.cursoService.desactivar(id).subscribe(
      response=>{
        $('#desactivar-'+id).modal('hide');
        $('.modal-backdrop').removeClass('show');
        this.loadCursos();
      },
      error=>{
        this.msm_error = 'No se pudo desactivar el curso, vuelva a intenter.'
      }
    )
  }

  activar(id){
    this.cursoService.activar(id).subscribe(
      response=>{

        $('#activar-'+id).modal('hide');
        $('.modal-backdrop').removeClass('show');
        this.loadCursos();
      },
      error=>{


        this.msm_error = 'No se pudo activar el curso, vuelva a intenter.'
      }
    )
  }

  // papelera(id){
  //   this.cursoService.papelera(id).subscribe(
  //     response=>{
  //       $('#papelera-'+id).modal('hide');
  //       $('.modal-backdrop').removeClass('show');
  //       this.loadCursos();

  //     },
  //     error=>{
  //       this.msm_error = 'No se pudo mover a papelera el curso, vuelva a intenter.'
  //     }
  //   )
  // }

  getVideoIframe(url) {
    var video, results;

    if (url === null) {
        return '';
    }
    results = url.match('[\\?&]v=([^&#]*)');
    video   = (results === null) ? url : results[1];

    return this._sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + video);
}



}
