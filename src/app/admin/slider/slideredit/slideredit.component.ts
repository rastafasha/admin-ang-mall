import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

import { FileUploadService } from 'src/app/services/file-upload.service';
import { UsuarioService } from '../../../services/usuario.service';
import { SliderService } from 'src/app/services/slider.service';
import { Slider } from 'src/app/models/slider.model';

interface HtmlInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

declare var bootstrap: any;

@Component({
  selector: 'app-slideredit',
  standalone: false,
  templateUrl: './slideredit.component.html',
  styleUrls: ['./slideredit.component.css']
})
export class SlidereditComponent implements OnInit, OnChanges {

  @Input() sliderSeleccionado;
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
  @Output() refreshSliderList: EventEmitter<void> = new EventEmitter<void>();

  public file: File;
  public imgSelect: String | ArrayBuffer;
  public url;
  public identity;
  public msm_error = false;
  public msm_success = false;
  public isLoadingImage = false;
  public slider: any = {};
  pageTitle: string;

  public sliderForm: FormGroup;

  public sliders: Slider[] = [];

  public imagenSubir: File;
  public imgTemp: any = null;

  banner;
  currentStep = 1;
  

  constructor(
    private fb: FormBuilder,
    private sliderService: SliderService,
    private userService: UsuarioService,
    private fileUploadService: FileUploadService,
  ) {
    this.url = environment.baseUrl;
    this.identity = this.userService.usuario;
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.validarFormulario();
  }

  validarFormulario() {
    this.sliderForm = this.fb.group({
      first_title: [''],
      subtitulo: [''],
      enlace: ['', Validators.required],
      status: ['', Validators.required],
      target: [''],
      align: [''],
      color: [''],
      mostrarInfo: [''],
      mostrarboton: [''],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (
      changes['sliderSeleccionado'] &&
      changes['sliderSeleccionado'].currentValue
    ) {
      this.pageTitle = 'Editando Slider';
      const slider = changes['sliderSeleccionado'].currentValue;
      this.sliderForm.patchValue({
        id: slider._id,
        first_title: slider.first_title,
        subtitulo: slider.subtitulo,
        enlace: slider.enlace,
        status: slider.status,
        target: slider.target,
        align: slider.align,
        color: slider.color,
        mostrarInfo: slider.mostrarInfo,
        mostrarboton: slider.mostrarboton,
        img: slider.img
      });
      this.sliderSeleccionado = slider;
      this.pageTitle = 'Editando Slider';
    } else {
      this.pageTitle = 'Creando Slider';
    }
  }

  onClose() {
    this.sliderSeleccionado = null;
    this.currentStep = 1;
    this.sliderForm.reset();
    this.pageTitle = 'Creando Proyecto';
    // Also reset default values if needed
    this.sliderForm.patchValue({
      id: null,
      first_title: null,
      subtitulo: null,
      enlace: null,
      status: null,
      target: null,
      align: null,
      color: null,
      mostrarInfo: null,
      mostrarboton: null,
      img: null
    });
    // Emit event to parent to reset the projectSeleccionado variable

    this.closeModal.emit();
  }

  nextStep() {
    const first_title = this.sliderForm.get('first_title');
    const subtitulo = this.sliderForm.get('subtitulo');
    const status = this.sliderForm.get('status');
    const enlace = this.sliderForm.get('enlace');
    const target = this.sliderForm.get('target');
    const align = this.sliderForm.get('align');
    const color = this.sliderForm.get('color');
    const mostrarInfo = this.sliderForm.get('mostrarInfo');
    const mostrarboton = this.sliderForm.get('mostrarboton');

    if (first_title?.invalid || subtitulo?.invalid ||
      status?.invalid || enlace?.invalid ||
      target?.invalid || align?.invalid ||
      color?.invalid || mostrarInfo?.invalid ||
      mostrarboton?.invalid

    ) {
      first_title?.markAsTouched();
      subtitulo?.markAsTouched();
      status?.markAsTouched();
      enlace?.markAsTouched();
      target?.markAsTouched();
      align?.markAsTouched();
      color?.markAsTouched();
      mostrarInfo?.markAsTouched();
      mostrarboton?.markAsTouched();
      return;
    }
    this.currentStep = 2;
  }

  prevStep() {
    this.currentStep = 1;
  }





  onSubmit() {

    if (!this.sliderForm.valid) {
      //mostramos las alertas de los campos requeridos
      this.sliderForm.markAllAsTouched(); // Esto activa las validaciones visuales
      return
    }
    const {
      first_title, subtitulo, enlace, target, status, mostrarInfo, mostrarboton, align, color
    } = this.sliderForm.value;

    if (this.sliderSeleccionado) {
      //actualizar

      const data = {
        ...this.sliderForm.value,
        _id: this.sliderSeleccionado._id
      }
      this.sliderService.actualizarSlider(data).subscribe(
        resp => {
          Swal.fire('Actualizado', `${first_title} actualizado correctamente`, 'success');
          // Close modal programmatically
          const modalElement = document.getElementById('editSlider');
          const modal = bootstrap.Modal.getInstance(modalElement);
          if (modal) {
            modal.hide();

          }
          // Emit event to refresh project list
          this.refreshSliderList.emit();
          this.ngOnInit()
        });

    } else {
      //crear
      this.sliderService.crearSlider(this.sliderForm.value)
        .subscribe((resp: any) => {
          this.sliderSeleccionado = resp.slider;
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
      .actualizarFoto(this.imagenSubir, 'sliders', this.sliderSeleccionado._id)
      .then(img => {
        this.sliderSeleccionado.img = img;
        this.isLoadingImage = true;
        Swal.fire('Guardado', 'La imagen fue actualizada', 'success');

      }).catch(err => {
        Swal.fire('Error', 'No se pudo subir la imagen', 'error');

      })
  }

 

}
