import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

import { FileUploadService } from 'src/app/services/file-upload.service';
import { Categoria } from 'src/app/models/categoria.model';
import { Usuario } from 'src/app/models/usuario.model';
import { CategoriaService } from 'src/app/services/categoria.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { IconosService } from 'src/app/services/iconos.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
interface HtmlInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

declare var bootstrap: any;

@Component({
  selector: 'app-cat-edit',
  standalone: false,
  templateUrl: './cat-edit.component.html',
  styleUrls: ['./cat-edit.component.css'],
  providers: [IconosService]
})
export class CatEditComponent implements OnInit, OnChanges {

  @Input() categoriaSeleccionado;
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
  @Output() refreshCatList: EventEmitter<void> = new EventEmitter<void>();

  public categoriaForm: FormGroup;
  public categoria: Categoria;
  public usuario: Usuario;
  public imagenSubir: File;
  public imgTemp: any = null;

  banner: string;
  pageTitle: string;
  listIcons;
  state_banner: boolean;

  public Editor = ClassicEditor;

  currentStep = 1;

  constructor(
    private fb: FormBuilder,
    private categoriaService: CategoriaService,
    private usuarioService: UsuarioService,
    private fileUploadService: FileUploadService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private _iconoService: IconosService,
  ) {
    this.usuario = usuarioService.usuario;
    const base_url = environment.baseUrl;
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.cargar_iconos();
    this.validarFormulario();
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (
      changes['categoriaSeleccionado'] &&
      changes['categoriaSeleccionado'].currentValue
    ) {
      this.pageTitle = 'Editando Categoria';
      const categoria = changes['categoriaSeleccionado'].currentValue;
      this.categoriaForm.patchValue({
        id: categoria._id,
        nombre: categoria.nombre,
        subcategorias: categoria.subcategorias,
        icono: categoria.icono,
        state_banner: categoria.state_banner,
      });
      this.categoriaSeleccionado = categoria;
      this.pageTitle = 'Editando Categoria';
    } else {
      this.pageTitle = 'Creando Categoria';
    }
  }

  onClose() {
    this.categoriaSeleccionado = null;
    this.currentStep = 1;
    this.categoriaForm.reset();
    this.pageTitle = 'Creando Proyecto';
    // Also reset default values if needed
    this.categoriaForm.patchValue({
      id: null,
      nombre: null,
      subcategorias: null,
      icono: null,
      state_banner: null,
    });
    // Emit event to parent to reset the projectSeleccionado variable

    this.closeModal.emit();
  }

  nextStep() {
    const nombre = this.categoriaForm.get('nombre');
    const subcategorias = this.categoriaForm.get('subcategorias');
    const icono = this.categoriaForm.get('icono');
    const state_banner = this.categoriaForm.get('state_banner');

    if (nombre?.invalid || subcategorias?.invalid ||
      icono?.invalid || state_banner?.invalid

    ) {
      nombre?.markAsTouched();
      subcategorias?.markAsTouched();
      icono?.markAsTouched();
      state_banner?.markAsTouched();
      return;
    }
    this.currentStep = 2;
  }

  prevStep() {
    this.currentStep = 1;
  }


  validarFormulario() {
    this.categoriaForm = this.fb.group({
      nombre: ['', Validators.required],
      subcategorias: ['', Validators.required],
      icono: ['', Validators.required],
      state_banner: ['false', Validators.required]
    })
  }

  cargar_iconos() {
    this._iconoService.getIcons().subscribe(
      (resp: any) => {
        this.listIcons = resp.iconos;
        // console.log(this.listIcons.iconos)

      }
    )
  }

  updateCategoria() {

    if (!this.categoriaForm.valid) {
      //mostramos las alertas de los campos requeridos
      this.categoriaForm.markAllAsTouched(); // Esto activa las validaciones visuales
      return
    }

    const { nombre, subcategorias } = this.categoriaForm.value;

    if (this.categoriaSeleccionado) {
      //actualizar
      const data = {
        ...this.categoriaForm.value,
        _id: this.categoriaSeleccionado._id
      }
      this.categoriaService.actualizarCategoria(data).subscribe(
        resp => {
          Swal.fire('Actualizado', `${nombre} actualizado correctamente`, 'success');
          const modalElement = document.getElementById('editCategoria');
          const modal = bootstrap.Modal.getInstance(modalElement);
          if (modal) {
            modal.hide();

          }
          // Emit event to refresh project list
          this.refreshCatList.emit();
          this.ngOnInit()
        });

    } else {
      //crear
      this.categoriaService.crearCategoria(this.categoriaForm.value)
        .subscribe((resp: any) => {
          this.categoriaSeleccionado = resp.categoria;
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
    this.fileUploadService
      .actualizarFoto(this.imagenSubir, 'categorias', this.categoriaSeleccionado._id)
      .then(img => {
        this.categoriaSeleccionado.img = img;
        Swal.fire('Guardado', 'La imagen fue actualizada', 'success');

      }).catch(err => {
        Swal.fire('Error', 'No se pudo subir la imagen', 'error');

      })
  }


  goBack() {
    this.location.back(); // <-- go back to previous location on cancel
  }
}
