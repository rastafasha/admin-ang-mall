import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { UsuarioService } from '../../../services/usuario.service';
import { PromocionService } from 'src/app/services/promocion.service';
import { Promocion } from 'src/app/models/promocion.model';

interface HtmlInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

declare var bootstrap: any;

@Component({
  selector: 'app-promoedit',
  standalone: false,
  templateUrl: './promoedit.component.html',
  styleUrls: ['./promoedit.component.css']
})
export class PromoeditComponent implements OnInit, OnChanges {

  @Input() promocionSeleccionado;
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
  @Output() refreshPromoList: EventEmitter<void> = new EventEmitter<void>();

  public file: File;
  public imgSelect: String | ArrayBuffer;
  public url;
  public identity;
  public msm_error = false;
  public msm_success = false;
  public isLoadingImage = false;
  public promocion: any = {};

  public promocionForm: FormGroup;

  public promocions: Promocion[] = [];

  public imagenSubir: File;
  public imgTemp: any = null;
  currentStep = 1;
  pageTitle: string;
  banner;

  constructor(
    private fb: FormBuilder,
    private promocionService: PromocionService,
    private userService: UsuarioService,
    private fileUploadService: FileUploadService,
    private router: Router,
  ) {
    this.url = environment.baseUrl;
    this.identity = this.userService.usuario;
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.validarFormulario();

  }

  validarFormulario() {
    this.promocionForm = this.fb.group({
      producto_title: ['', Validators.required],
      first_title: ['', Validators.required],
      etiqueta: ['', Validators.required],
      subtitulo: ['', Validators.required],
      end: ['', Validators.required],
      enlace: ['', Validators.required],
      estado: [''],
      colorfondo: ['', Validators.required]
    })
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (
      changes['promocionSeleccionado'] &&
      changes['promocionSeleccionado'].currentValue
    ) {
      this.pageTitle = 'Editando Promoción';
      const promocion = changes['promocionSeleccionado'].currentValue;
      this.promocionForm.patchValue({
        id: promocion._id,
        producto_title: promocion.producto_title,
        first_title: promocion.first_title,
        etiqueta: promocion.etiqueta,
        subtitulo: promocion.subtitulo,
        end: promocion.end,
        enlace: promocion.enlace,
        estado: promocion.estado,
        colorfondo: promocion.colorfondo,
        img: promocion.img
      });
      this.promocionSeleccionado = promocion;
      this.pageTitle = 'Editando Promoción';
    } else {
      this.pageTitle = 'Creando Promoción';
    }
  }

  onClose() {
    this.promocionSeleccionado = null;
    this.currentStep = 1;
    this.promocionForm.reset();
    this.pageTitle = 'Creando Promoción';
    // Also reset default values if needed
    this.promocionForm.patchValue({
      id: null,
      first_title: null,
      producto_title: null,
      etiqueta: null,
      subtitulo: null,
      end: null,
      enlace: null,
      estado: null,
      colorfondo: null,
      img: null
    });
    // Emit event to parent to reset the projectSeleccionado variable

    this.closeModal.emit();
  }

  nextStep() {
    const first_title = this.promocionForm.get('first_title');
    const producto_title = this.promocionForm.get('producto_title');
    const subtitulo = this.promocionForm.get('subtitulo');
    const etiqueta = this.promocionForm.get('etiqueta');
    const end = this.promocionForm.get('end');
    const enlace = this.promocionForm.get('enlace');
    const estado = this.promocionForm.get('estado');
    const colorfondo = this.promocionForm.get('colorfondo');

    if (first_title?.invalid || producto_title?.invalid ||
      subtitulo?.invalid || etiqueta?.invalid ||
      end?.invalid || enlace?.invalid ||
      estado?.invalid || colorfondo?.invalid

    ) {
      first_title?.markAsTouched();
      producto_title?.markAsTouched();
      subtitulo?.markAsTouched();
      etiqueta?.markAsTouched();
      end?.markAsTouched();
      enlace?.markAsTouched();
      estado?.markAsTouched();
      colorfondo?.markAsTouched();
      return;
    }
    this.currentStep = 2;
  }

  prevStep() {
    this.currentStep = 1;
  }


  onSubmit() {

    if (!this.promocionForm.valid) {
      //mostramos las alertas de los campos requeridos
      this.promocionForm.markAllAsTouched(); // Esto activa las validaciones visuales
      return
    }

    const {
      producto_title,
      first_title,
      etiqueta,
      subtitulo,
      end,
      enlace,
      estado,
      colorfondo
    } = this.promocionForm.value;

    if (this.promocionSeleccionado) {
      //actualizar
      const data = {
        ...this.promocionForm.value,
        _id: this.promocionSeleccionado._id
      }
      this.promocionService.actualizarPromocion(data).subscribe(
        resp => {
          Swal.fire('Actualizado', `${producto_title} actualizado correctamente`, 'success');
          // Close modal programmatically
          const modalElement = document.getElementById('editPromocion');
          const modal = bootstrap.Modal.getInstance(modalElement);
          if (modal) {
            modal.hide();

          }
          // Emit event to refresh project list
          this.refreshPromoList.emit();
          this.ngOnInit()
        });

    } else {
      //crear
      this.promocionService.crearPromocion(this.promocionForm.value)
        .subscribe((resp: any) => {
          this.promocionSeleccionado = resp.promocion;
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
      .actualizarFoto(this.imagenSubir, 'promocions', this.promocionSeleccionado._id)
      .then(img => {
        this.promocionSeleccionado.img = img;
        this.isLoadingImage = false;
        Swal.fire('Guardado', 'La imagen fue actualizada', 'success');

      }).catch(err => {
        Swal.fire('Error', 'No se pudo subir la imagen', 'error');

      })
  }


}
