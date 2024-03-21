import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';

import { environment } from 'src/environments/environment';

import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';

import { Videogaleria } from 'src/app/models/videogaleria.model';
import { VideogaleriaService } from 'src/app/services/videgaleria.service';
import { Curso } from 'src/app/models/curso.model';
import { CursoService } from 'src/app/services/curso.service';


interface HtmlInputEvent extends Event{
  target : HTMLInputElement & EventTarget;
}

declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-video-edit',
  templateUrl: './video-edit.component.html',
  styleUrls: ['./video-edit.component.css']
})
export class VideoEditComponent implements OnInit {


  public videoForm: FormGroup;
  public usuario: Usuario;
  public galeriavideo;
  public select_curso;

  public titulo;
  public video;
  public id;
  public cursos: Curso[] =[];

  pageTitle: string;

  public videoSeleccionado: Videogaleria;

  constructor(
    private fb: FormBuilder,
    private videogaleriaService: VideogaleriaService,
    private usuarioService: UsuarioService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private cursoService: CursoService,
  ) {
    this.usuario = usuarioService.usuario;
    const base_url = environment.baseUrl;
  }

  ngOnInit(): void {
    window.scrollTo(0,0);
    this.validarFormulario();
    this.loadCursos();
    // this.activatedRoute.params.subscribe( ({id}) => this.loadVideo(id));
    this.activatedRoute.params.subscribe( ({id}) => this.iniciarFormulario(id));


    if(this.videoSeleccionado){
      //actualizar
      this.pageTitle = 'Create Video';

    }else{
      //crear
      this.pageTitle = 'Edit Video';
    }

  }

  validarFormulario(){
    this.videoForm = this.fb.group({
      titulo: ['',Validators.required],
      curso: ['',Validators.required],
      urlYoutube: [''],
      urlVimeo: [''],
      fileVideo: [''],
      status: [''],
    })
  }

  loadVideo(_id: string){
    this.videogaleriaService.get_video(_id).subscribe(
      response =>{
        this.galeriavideo = response;
        console.log(this.galeriavideo);
      },
      error=>{

      }
    );

  }


  iniciarFormulario(id: string){


    if(!id !== null && id !== undefined){
      this.pageTitle = 'Edit Video';
      this.videogaleriaService.get_video(id).subscribe(
        res => {
          this.videoForm.patchValue({
            id: res._id,
            titulo: res.titulo,
            urlYoutube: res.urlYoutube,
            urlVimeo: res.urlVimeo,
            fileVideo: res.fileVideo,
            curso: res.curso,
            status: res.status,
          });
          this.videoSeleccionado = res;
          console.log(this.videoSeleccionado);
        }
      );
    } else {
      this.pageTitle = 'Create Video';
    }

  }

  loadCursos(){
    // this.cargando = true;
    this.cursoService.getCursos().subscribe(
      resp => {
        // this.cargando = false;
        this.cursos = resp;
        console.log(this.cursos);
      }
    )

  }



  updateCurso(){

    const {titulo, urlYoutube,urlVimeo,fileVideo,status, curso } = this.videoForm.value;

    if(this.videoSeleccionado){
      //actualizar
      const data = {
        ...this.videoForm.value,
        _id: this.videoSeleccionado._id
      }
      this.videogaleriaService.actualizarVideo(data).subscribe(
        resp =>{
          Swal.fire('Actualizado', `${titulo}  actualizado correctamente`, 'success');
          console.log(this.videoSeleccionado);
        });

    }else{
      //crear
      this.videogaleriaService.create(this.videoForm.value)
      .subscribe( (resp: any) =>{
        Swal.fire('Creado', `${titulo} creado correctamente`, 'success');
        this.router.navigateByUrl(`/dashboard/curso/curso-video`);
      })
    }

  }



  goBack() {
    this.location.back(); // <-- go back to previous location on cancel
  }

}
