import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { environment } from 'src/environments/environment';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';
import { CategoriaService } from 'src/app/services/categoria.service';
import { Page } from 'src/app/models/page.model';
import { PageService } from 'src/app/services/page.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';


interface HtmlInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

declare var bootstrap: any;

@Component({
  selector: 'app-page-edit',
  standalone: false,
  templateUrl: './page-edit.component.html',
  styleUrls: ['./page-edit.component.css'],
  providers: [
    CategoriaService
  ]
})
export class PageEditComponent implements OnInit, OnChanges {

  @Input() pageSeleccionado;
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
  @Output() refreshPageList: EventEmitter<void> = new EventEmitter<void>();

  public pageForm: FormGroup;
  public page: Page;
  public usuario: Usuario;
  public imagenSubir: File;
  public imgTemp: any = null;
  public file: File;
  public imgSelect: String | ArrayBuffer;
  public listMarcas;
  public listCategorias;
  isLoadingImage = false;

  banner: string;
  pageTitle: string;

  public Editor = ClassicEditor;
  currentStep = 1;

  constructor(
    private fb: FormBuilder,
    private pageService: PageService,
    private usuarioService: UsuarioService,
    private categoriaService: CategoriaService,
    private fileUploadService: FileUploadService,
    private sanitizer: DomSanitizer
  ) {
    this.usuario = usuarioService.usuario;
    const base_url = environment.baseUrl;
  }

  ngOnInit(): void {

    window.scrollTo(0, 0);
    this.getCategorias();
    this.validarFormulario();
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (
      changes['pageSeleccionado'] &&
      changes['pageSeleccionado'].currentValue
    ) {
      this.pageTitle = 'Editando Page';
      const page = changes['pageSeleccionado'].currentValue;
      this.pageForm.patchValue({
        id: page._id,
        titulo: page.titulo,
        descripcion: page.descripcion,
        video_review: page.video_review,
        categoria: page.categoria,
        isFeatured: page.isFeatured,
        origen: page.origen,
        slug: page.slug,
        user_id: this.usuario.uid,
        img: page.img
      });
      this.pageSeleccionado = page;
      this.pageTitle = 'Editando Page';
    } else {
      this.pageTitle = 'Creando Page';
    }
  }

  onClose() {
    this.pageSeleccionado = null;
    this.currentStep = 1;
    this.pageForm.reset();
    this.pageTitle = 'Creando Proyecto';
    // Also reset default values if needed
    this.pageForm.patchValue({
      id: null,
      titulo: null,
      descripcion: null,
      video_review: null,
      categoria: null,
      isFeatured: null,
      origen: null,
      slug: null,
      user_id: null,
      img: null
    });
    // Emit event to parent to reset the projectSeleccionado variable

    this.closeModal.emit();
  }

  nextStep() {
    const titulo = this.pageForm.get('titulo');
    const descripcion = this.pageForm.get('descripcion');
    const categoria = this.pageForm.get('categoria');
    const video_review = this.pageForm.get('video_review');
    const isFeatured = this.pageForm.get('isFeatured');
    const origen = this.pageForm.get('origen');

    if (titulo?.invalid || descripcion?.invalid ||
      categoria?.invalid || video_review?.invalid ||
      isFeatured?.invalid ||
      origen?.invalid

    ) {
      titulo?.markAsTouched();
      descripcion?.markAsTouched();
      categoria?.markAsTouched();
      video_review?.markAsTouched();
      isFeatured?.markAsTouched();
      origen?.markAsTouched();
      return;
    }
    this.currentStep = 2;
  }

  prevStep() {
    this.currentStep = 1;
  }


  validarFormulario() {
    this.pageForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      categoria: ['', Validators.required],
      slug: [''],
      isFeatured: [''],
      origen: [''],
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





  updatePage() {
    if (!this.pageForm.valid) {
      //mostramos las alertas de los campos requeridos
      this.pageForm.markAllAsTouched(); // Esto activa las validaciones visuales
      return
    }

    const { titulo, descripcion, categoria, isFeatured, slug, origen,
      video_review, } = this.pageForm.value;

    if (this.pageSeleccionado) {
      //actualizar
      const data = {
        ...this.pageForm.value,
        _id: this.pageSeleccionado._id
      }
      this.pageService.actualizarPage(data).subscribe(
        resp => {
          Swal.fire('Actualizado', `${titulo}  actualizado correctamente`, 'success');
          // Close modal programmatically
          const modalElement = document.getElementById('editPage');
          const modal = bootstrap.Modal.getInstance(modalElement);
          if (modal) {
            modal.hide();

          }
          // Emit event to refresh project list
          this.refreshPageList.emit();
          this.ngOnInit()
        });

    } else {
      //crear
      this.pageService.crearPage(this.pageForm.value)
        .subscribe((resp: any) => {
          this.pageSeleccionado = resp.page;
          Swal.fire('¡Paso 1 completado!', 'Post creado. Ahora sube la imagen.', 'success');
          // Como estmos creando, al finalizar debe ir al paso 2 para subir la imagen
          this.currentStep = 2;
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
      .actualizarFoto(this.imagenSubir, 'pages', this.pageSeleccionado._id)
      .then(img => {
        this.pageSeleccionado.img = img;
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
