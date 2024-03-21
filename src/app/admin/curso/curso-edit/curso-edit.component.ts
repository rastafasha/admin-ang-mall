import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';

import { FileUploadService } from 'src/app/services/file-upload.service';
import { environment } from 'src/environments/environment';

import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';
import { CategoriaService } from 'src/app/services/categoria.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';

import { Curso } from 'src/app/models/curso.model';
import { CursoService } from 'src/app/services/curso.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';


interface HtmlInputEvent extends Event{
  target : HTMLInputElement & EventTarget;
}

declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-curso-edit',
  templateUrl: './curso-edit.component.html',
  styleUrls: ['./curso-edit.component.css'],
  providers:[
    CategoriaService
  ]
})
export class CursoEditComponent implements OnInit {


  public cursoForm: FormGroup;
  public curso: Curso;
  public usuario: Usuario;
  public imagenSubir: File;
  public imgTemp: any = null;
  public file :File;
  public imgSelect : String | ArrayBuffer;
  public listMarcas;
  public listCategorias;

  banner: string;
  pageTitle: string;

  public cursoSeleccionado: Curso;
  public Editor = ClassicEditor;
  public Editor1 = ClassicEditor;

  constructor(
    private fb: FormBuilder,
    private cursoService: CursoService,
    private usuarioService: UsuarioService,
    private modalImagenService: ModalImagenService,
    private categoriaService: CategoriaService,
    private fileUploadService: FileUploadService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private sanitizer: DomSanitizer
  ) {
    this.usuario = usuarioService.usuario;
    const base_url = environment.baseUrl;
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe( ({id}) => this.cargarCurso(id));

    window.scrollTo(0,0);
    this.getCategorias();
    this.validarFormulario();

    if(this.cursoSeleccionado){
      //actualizar
      this.pageTitle = 'Create Curso';

    }else{
      //crear
      this.pageTitle = 'Edit Curso';
    }



  }

  validarFormulario(){
    this.cursoForm = this.fb.group({
      titulo: ['',Validators.required],
      precio_ahora: ['',Validators.required],
      precio_antes: ['',Validators.required],
      detalle: ['',Validators.required],
      info_short: ['',Validators.required],
      categoria: ['',Validators.required],
      isFeatured: [''],
      video_review: [''],
    })
  }

  getCategorias(){
    this.categoriaService.cargarCategorias().subscribe(
      resp =>{
        this.listCategorias = resp;
        console.log(this.listCategorias)

      }
    )
  }

  cargarCurso(_id: string){

    if (_id) {
      this.pageTitle = 'Edit Curso';
      this.cursoService.getCursoById(_id).subscribe(
        res => {
          this.cursoForm.patchValue({
            id: res._id,
            titulo: res.titulo,
            detalle: res.detalle,
            precio_ahora: res.precio_ahora,
            precio_antes: res.precio_antes,
            video_review: res.video_review,
            info_short: res.info_short,
            categoria: res.categoria,
            isFeatured: res.isFeatured,
            user_id: this.usuario.uid,
            img : res.img
          });
          this.cursoSeleccionado = res;
          console.log(this.cursoSeleccionado);
        }
      );
    } else {
      this.pageTitle = 'Create Curso';
    }

  }





  updateCurso(){

    const {titulo, precio_antes,info_short,detalle,categoria, isFeatured,
      video_review,precio_ahora, } = this.cursoForm.value;

    if(this.cursoSeleccionado){
      //actualizar
      const data = {
        ...this.cursoForm.value,
        _id: this.cursoSeleccionado._id
      }
      this.cursoService.actualizarCurso(data).subscribe(
        resp =>{
          Swal.fire('Actualizado', `${titulo}  actualizado correctamente`, 'success');
          console.log(this.cursoSeleccionado);
        });

    }else{
      //crear
      this.cursoService.crearCurso(this.cursoForm.value)
      .subscribe( (resp: any) =>{
        Swal.fire('Creado', `${titulo} creado correctamente`, 'success');
        this.router.navigateByUrl(`/dashboard/curso`);
      })
    }

  }


  cambiarImagen(file: File){
    this.imagenSubir = file;

    if(!file){
      return this.imgTemp = null;
    }

    const reader = new FileReader();
    const url64 = reader.readAsDataURL(file);

    reader.onloadend = () =>{
      this.imgTemp = reader.result;
    }
  }

  subirImagen(){
    this.fileUploadService
    .actualizarFoto(this.imagenSubir, 'cursos', this.cursoSeleccionado._id)
    .then(img => { this.cursoSeleccionado.img = img;
      Swal.fire('Guardado', 'La imagen fue actualizada', 'success');

    }).catch(err =>{
      Swal.fire('Error', 'No se pudo subir la imagen', 'error');

    })
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

    return this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + video);
}


}
