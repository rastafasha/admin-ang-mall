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

import { Page } from 'src/app/models/page.model';
import { PageService } from 'src/app/services/page.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';


interface HtmlInputEvent extends Event{
  target : HTMLInputElement & EventTarget;
}

declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-page-edit',
  templateUrl: './page-edit.component.html',
  styleUrls: ['./page-edit.component.css'],
  providers:[
    CategoriaService
  ]
})
export class PageEditComponent implements OnInit {


  public pageForm: FormGroup;
  public page: Page;
  public usuario: Usuario;
  public imagenSubir: File;
  public imgTemp: any = null;
  public file :File;
  public imgSelect : String | ArrayBuffer;
  public listMarcas;
  public listCategorias;

  banner: string;
  pageTitle: string;

  public pageSeleccionado: Page;
  public Editor = ClassicEditor;

  constructor(
    private fb: FormBuilder,
    private pageService: PageService,
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
    this.activatedRoute.params.subscribe( ({id}) => this.cargarPage(id));

    window.scrollTo(0,0);
    this.getCategorias();
    this.validarFormulario();

    if(this.pageSeleccionado){
      //actualizar
      this.pageTitle = 'Create Page';

    }else{
      //crear
      this.pageTitle = 'Edit Page';
    }



  }

  validarFormulario(){
    this.pageForm = this.fb.group({
      titulo: ['',Validators.required],
      descripcion: ['',Validators.required],
      categoria: ['',Validators.required],
      slug: [''],
      isFeatured: [''],
      origen: [''],
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

  cargarPage(_id: string){

    if (_id) {
      this.pageTitle = 'Edit Page';
      this.pageService.getPageById(_id).subscribe(
        res => {
          this.pageForm.patchValue({
            id: res._id,
            titulo: res.titulo,
            descripcion: res.descripcion,
            video_review: res.video_review,
            categoria: res.categoria,
            isFeatured: res.isFeatured,
            origen: res.origen,
            slug: res.slug,
            user_id: this.usuario.uid,
            img : res.img
          });
          this.pageSeleccionado = res;
          console.log(this.pageSeleccionado);
        }
      );
    } else {
      this.pageTitle = 'Create Page';
    }

  }





  updatePage(){

    const {titulo, descripcion,categoria, isFeatured,slug,origen,
      video_review, } = this.pageForm.value;

    if(this.pageSeleccionado){
      //actualizar
      const data = {
        ...this.pageForm.value,
        _id: this.pageSeleccionado._id
      }
      this.pageService.actualizarPage(data).subscribe(
        resp =>{
          Swal.fire('Actualizado', `${titulo}  actualizado correctamente`, 'success');
          console.log(this.pageSeleccionado);
        });

    }else{
      //crear
      this.pageService.crearPage(this.pageForm.value)
      .subscribe( (resp: any) =>{
        Swal.fire('Creado', `${titulo} creado correctamente`, 'success');
        this.router.navigateByUrl(`/dashboard/page`);
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
    .actualizarFoto(this.imagenSubir, 'pages', this.pageSeleccionado._id)
    .then(img => { this.pageSeleccionado.img = img;
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
