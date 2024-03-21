import { Component, OnDestroy, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { BusquedasService } from '../../../services/busquedas.service';
import { Videogaleria } from '../../../models/videogaleria.model';
import { VideogaleriaService } from '../../../services/videgaleria.service';
import { Curso } from 'src/app/models/curso.model';
import { CursoService } from 'src/app/services/curso.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-video-index',
  templateUrl: './video-index.component.html',
  styleUrls: ['./video-index.component.css']
})
export class VideoIndexComponent implements OnInit {

  public cursos: Curso[] =[];
  public curso: Curso;
  public videocursos: Videogaleria[]=[];
  public galeriavideo: any = {};
  public cargando: boolean = true;

  public select_curso;

  p: number = 1;
  count: number = 8;

  public msm_error;
  public _id;

  constructor(
    private videoService: VideogaleriaService,
    private cursoService: CursoService,
    private busquedaService: BusquedasService,
    private activatedRoute : ActivatedRoute,
    private router : Router,
    private location: Location,
    private _sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
    this.loadVideos();
    // this.activatedRoute.params.subscribe( ({id}) => this.loadCursos(id));
    // this.activatedRoute.params.subscribe( ({id}) => this.loadVideos(id));
  }

  loadCursos(_id: string){
    this.cursoService.getCursoById(_id).subscribe(
      response =>{
        this.curso = response;
        console.log(this.curso);
      },
      error=>{

      }
    );

  }


  loadVideos(){

    this.videoService.getVideos().subscribe(
      response =>{

        this.videocursos = response;
        this.cargando = false;
        console.log(this.videocursos);
      }
    );

  }




  eliminarVideo(_id: string){
    this.videoService.eliminar(this.galeriavideo._id)
    .subscribe( resp => {
      Swal.fire('Borrado', this.galeriavideo.titulo, 'success')
      this.ngOnInit();
    })

  }

  buscar(termino: string){

    // if(termino.length === 0){
    //   return this.loadCategorias();
    // }

    // this.busquedaService.buscar('cursos', termino)
    // .subscribe( resultados => {
    //   resultados;
    // })
  }




  desactivar(id){
    this.videoService.desactivar(id).subscribe(
      response=>{
        $('#desactivar-'+id).modal('hide');
        $('.modal-backdrop').removeClass('show');
        this.ngOnInit();
      },
      error=>{
        this.msm_error = 'No se pudo desactivar el curso, vuelva a intenter.'
      }
    )
  }

  activar(id){
    this.videoService.activar(id).subscribe(
      response=>{

        $('#activar-'+id).modal('hide');
        $('.modal-backdrop').removeClass('show');
        this.ngOnInit();
      },
      error=>{


        this.msm_error = 'No se pudo activar el curso, vuelva a intenter.'
      }
    )
  }

  goBack() {
    this.location.back(); // <-- go back to previous location on cancel
  }

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
