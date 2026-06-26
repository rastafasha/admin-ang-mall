import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';
import { CategoriaService } from 'src/app/services/categoria.service';
import { Blog } from 'src/app/models/blog.model';
import { BlogService } from 'src/app/services/blog.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
interface HtmlInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

declare var bootstrap: any;

@Component({
  selector: 'app-blog-edit',
  standalone: false,
  templateUrl: './blog-edit.component.html',
  styleUrls: ['./blog-edit.component.css'],
  providers: [
    CategoriaService
  ]
})
export class BlogEditComponent implements OnInit, OnChanges {

  @Input() postSeleccionado;
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
  @Output() refreshPostList: EventEmitter<void> = new EventEmitter<void>();

  public blogForm: FormGroup;
  public blog: Blog;
  public usuario: Usuario;
  public imagenSubir: File;
  public imgTemp: any = null;
  public file: File;
  public imgSelect: String | ArrayBuffer;
  public listMarcas;
  public listCategorias;
  isLoadingImage = false;
  isLoading = false;

  banner: string;
  pageTitle: string;


  public Editor = ClassicEditor;

  currentStep = 1;

  constructor(
    private fb: FormBuilder,
    private blogService: BlogService,
    private usuarioService: UsuarioService,
    private categoriaService: CategoriaService,
    private fileUploadService: FileUploadService,
    private sanitizer: DomSanitizer
  ) {
    this.usuario = usuarioService.usuario;
  }

  ngOnInit(): void {

    window.scrollTo(0, 0);
    this.getCategorias();
    this.validarFormulario();

  }

  ngOnChanges(changes: SimpleChanges): void {

    if (
      changes['postSeleccionado'] &&
      changes['postSeleccionado'].currentValue
    ) {
      this.pageTitle = 'Editando Post';
      const post = changes['postSeleccionado'].currentValue;
      this.blogForm.patchValue({
        id: post._id,
        titulo: post.titulo,
        descripcion: post.descripcion,
        video_review: post.video_review,
        categoria: post.categoria,
        isFeatured: post.isFeatured,
        slug: post.slug,
        user_id: this.usuario.uid,
        img: post.img
      });
      this.postSeleccionado = post;
      this.pageTitle = 'Editando Post';
    } else {
      this.pageTitle = 'Creando Post';
    }
  }

  onClose() {
    this.postSeleccionado = null;
    this.currentStep = 1;
    this.blogForm.reset();
    this.pageTitle = 'Creando Proyecto';
    // Also reset default values if needed
    this.blogForm.patchValue({
      id: null,
      titulo: null,
      descripcion: null,
      video_review: null,
      categoria: null,
      isFeatured: null,
      slug: null,
      user_id: null,
      img: null
    });
    // Emit event to parent to reset the projectSeleccionado variable

    this.closeModal.emit();
  }

  nextStep() {
    const titulo = this.blogForm.get('titulo');
    const descripcion = this.blogForm.get('descripcion');
    const categoria = this.blogForm.get('categoria');
    const video_review = this.blogForm.get('video_review');
    const isFeatured = this.blogForm.get('isFeatured');

    if (titulo?.invalid || descripcion?.invalid ||
      categoria?.invalid || video_review?.invalid ||
      isFeatured?.invalid 

    ) {
      titulo?.markAsTouched();
      descripcion?.markAsTouched();
      categoria?.markAsTouched();
      video_review?.markAsTouched();
      isFeatured?.markAsTouched();
      return;
    }
    this.currentStep = 2;
  }

  prevStep() {
    this.currentStep = 1;
  }


  validarFormulario() {
    this.blogForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      categoria: ['', Validators.required],
      slug: [''],
      isFeatured: [''],
      video_review: [''],
    })
  }

  getCategorias() {
    this.categoriaService.cargarCategorias().subscribe(
      resp => {
        this.listCategorias = resp;

      }
    )
  }

  updateBlog() {

    if (!this.blogForm.valid) {
      this.blogForm.markAllAsTouched(); // Esto activa las validaciones visuales
      return
    }

    const { titulo, descripcion, categoria, isFeatured,
      video_review, } = this.blogForm.value;

    if (this.postSeleccionado) {
      //actualizar
      const data = {
        ...this.blogForm.value,
        _id: this.postSeleccionado._id
      }
      this.blogService.actualizarBlog(data).subscribe(
        resp => {
          Swal.fire('Actualizado', `${titulo}  actualizado correctamente`, 'success');
          // Close modal programmatically
          const modalElement = document.getElementById('editPost');
          const modal = bootstrap.Modal.getInstance(modalElement);
          if (modal) {
            modal.hide();

          }
          // Emit event to refresh project list
          this.refreshPostList.emit();
          this.ngOnInit()
        });

    } else {
      //crear
      this.blogService.crearBlog(this.blogForm.value)
        .subscribe((resp: any) => {
           this.postSeleccionado = resp.blog;
           Swal.fire('¡Paso 1 completado!', 'Post creado. Ahora sube la imagen.', 'success');
          // Como estmos creando, al finalizar debe ir al paso 2 para subir la imagen
          this.currentStep = 2;
        },
       err => {
          Swal.fire('Error', 'No se pudo crear el post', 'error');
        })
    }

  }


  cambiarImagen(file: File) {
    this.imagenSubir = file;

    if (!file) {
      return this.imgTemp = null;
    }

    const reader = new FileReader();
    const url64 = reader.readAsDataURL(file);

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    }
  }

  subirImagen() {
    this.isLoadingImage = true;
    this.fileUploadService
      .actualizarFoto(this.imagenSubir, 'blogs', this.postSeleccionado._id)
      .then(img => {
        this.postSeleccionado.img = img;
        this.isLoadingImage = false;
        Swal.fire('Guardado', 'La imagen fue actualizada', 'success');

      }).catch(err => {
        Swal.fire('Error', 'No se pudo subir la imagen', 'error');

      })
  }

 

  getVideoIframe(url) {
    var video, results;

    if (url === null) {
      return '';
    }
    results = url.match('[\\?&]v=([^&#]*)');
    video = (results === null) ? url : results[1];

    return this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + video);
  }


}
