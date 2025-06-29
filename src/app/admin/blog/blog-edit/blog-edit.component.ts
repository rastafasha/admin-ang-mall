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

import { Blog } from 'src/app/models/blog.model';
import { BlogService } from 'src/app/services/blog.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';


interface HtmlInputEvent extends Event{
  target : HTMLInputElement & EventTarget;
}

declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-blog-edit',
  templateUrl: './blog-edit.component.html',
  styleUrls: ['./blog-edit.component.css'],
  providers:[
    CategoriaService
  ]
})
export class BlogEditComponent implements OnInit {


  public blogForm: FormGroup;
  public blog: Blog;
  public usuario: Usuario;
  public imagenSubir: File;
  public imgTemp: any = null;
  public file :File;
  public imgSelect : String | ArrayBuffer;
  public listMarcas;
  public listCategorias;

  banner: string;
  pageTitle: string;

  public blogSeleccionado: Blog;

  public Editor = ClassicEditor;

  constructor(
    private fb: FormBuilder,
    private blogService: BlogService,
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
    this.activatedRoute.params.subscribe( ({id}) => this.cargarBlog(id));

    window.scrollTo(0,0);
    this.getCategorias();
    this.validarFormulario();

    if(this.blogSeleccionado){
      //actualizar
      this.pageTitle = 'Create Blog';

    }else{
      //crear
      this.pageTitle = 'Edit Blog';
    }



  }

  validarFormulario(){
    this.blogForm = this.fb.group({
      titulo: ['',Validators.required],
      descripcion: ['',Validators.required],
      categoria: ['',Validators.required],
      slug: [''],
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

  cargarBlog(_id: string){

    if (_id) {
      this.pageTitle = 'Edit Blog';
      this.blogService.getBlogById(_id).subscribe(
        res => {
          this.blogForm.patchValue({
            id: res._id,
            titulo: res.titulo,
            descripcion: res.descripcion,
            video_review: res.video_review,
            categoria: res.categoria,
            isFeatured: res.isFeatured,
            slug: res.slug,
            user_id: this.usuario.uid,
            img : res.img
          });
          this.blogSeleccionado = res;
          console.log(this.blogSeleccionado);
        }
      );
    } else {
      this.pageTitle = 'Create Blog';
    }

  }





  updateBlog(){

    const {titulo, descripcion,categoria, isFeatured,
      video_review, } = this.blogForm.value;

    if(this.blogSeleccionado){
      //actualizar
      const data = {
        ...this.blogForm.value,
        _id: this.blogSeleccionado._id
      }
      this.blogService.actualizarBlog(data).subscribe(
        resp =>{
          Swal.fire('Actualizado', `${titulo}  actualizado correctamente`, 'success');
          console.log(this.blogSeleccionado);
        });

    }else{
      //crear
      this.blogService.crearBlog(this.blogForm.value)
      .subscribe( (resp: any) =>{
        Swal.fire('Creado', `${titulo} creado correctamente`, 'success');
        this.router.navigateByUrl(`/dashboard/blog`);
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
    .actualizarFoto(this.imagenSubir, 'blogs', this.blogSeleccionado._id)
    .then(img => { this.blogSeleccionado.img = img;
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
