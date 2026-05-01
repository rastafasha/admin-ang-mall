import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';

import { Marca } from 'src/app/models/marca.model';
import { Usuario } from 'src/app/models/usuario.model';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { MarcaService } from 'src/app/services/marca.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { environment } from 'src/environments/environment';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

declare var bootstrap: any;
@Component({
  selector: 'app-marca-edit',
  standalone: false,
  templateUrl: './marca-edit.component.html',
  styleUrls: ['./marca-edit.component.css']
})
export class MarcaEditComponent implements OnInit, OnChanges {

  @Input() marcaSeleccionada;
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
  @Output() refreshMarcasList: EventEmitter<void> = new EventEmitter<void>();

  cargando = false;
  cargandoImagen = false;
  public marcaForm: FormGroup;
  public marca: Marca;
  public usuario: Usuario;
  public imagenSubir: File;
  public imgTemp: any = null;

  pageTitle: string;

  public Editor = ClassicEditor;

  currentStep = 1;

  constructor(
    private fb: FormBuilder,
    private marcaService: MarcaService,
    private usuarioService: UsuarioService,
    private fileUploadService: FileUploadService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location
  ) {
    this.usuario = usuarioService.usuario;
    const base_url = environment.baseUrl;
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.validarFormulario();
  }

  validarFormulario() {
    this.marcaForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required]
    })
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (
      changes['marcaSeleccionada'] &&
      changes['marcaSeleccionada'].currentValue
    ) {
      this.pageTitle = 'Editando Marca';
      const marca = changes['marcaSeleccionada'].currentValue;
      this.marcaForm.patchValue({
        id: marca._id,
        nombre: marca.nombre,
        descripcion: marca.descripcion,
        img: marca.img
      });
      this.marcaSeleccionada = marca;
      this.pageTitle = 'Editando Marca';
    } else {
      this.pageTitle = 'Creando Marca';
    }
  }

  onClose() {
    this.marcaSeleccionada = null;
    this.currentStep = 1;
    this.marcaForm.reset();
    this.pageTitle = 'Creando Marca';
    // Also reset default values if needed
    this.marcaForm.patchValue({
      id: null,
      nombre: null,
      descripcion: null,
      img: null
    });
    // Emit event to parent to reset the projectSeleccionado variable

    this.closeModal.emit();
  }

  nextStep() {
    const nombre = this.marcaForm.get('nombre');
    const descripcion = this.marcaForm.get('descripcion');

    if (nombre?.invalid || descripcion?.invalid

    ) {
      nombre?.markAsTouched();
      descripcion?.markAsTouched();
      return;
    }
    this.currentStep = 2;
  }

  prevStep() {
    this.currentStep = 1;
  }

  updateMarca() {
    if (!this.marcaForm.valid) {
      //mostramos las alertas de los campos requeridos
      this.marcaForm.markAllAsTouched(); // Esto activa las validaciones visuales
      return
    }

    this.cargando = true;
    const { nombre, descripcion } = this.marcaForm.value;

    if (this.marcaSeleccionada) {
      //actualizar
      const data = {
        ...this.marcaForm.value,
        _id: this.marcaSeleccionada._id
      }
      this.marcaService.actualizarMarca(data).subscribe(
        resp => {
          this.cargando = false;
          Swal.fire('Actualizado', `${nombre} actualizado correctamente`, 'success');
          // Close modal programmatically
          const modalElement = document.getElementById('editMarca');
          const modal = bootstrap.Modal.getInstance(modalElement);
          if (modal) {
            modal.hide();

          }
          // Emit event to refresh project list
          this.refreshMarcasList.emit();
          this.ngOnInit()
        });

    } else {
      //crear
      this.marcaService.crearMarca(this.marcaForm.value)
        .subscribe((resp: any) => {
          this.cargando = false;
          this.marcaSeleccionada = resp.marca;
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
    this.cargandoImagen = true;
    this.fileUploadService
      .actualizarFoto(this.imagenSubir, 'marcas', this.marcaSeleccionada._id)
      .then(img => {
        this.marcaSeleccionada.img = img;
        this.cargandoImagen = false;
        Swal.fire('Guardado', 'La imagen fue actualizada', 'success');

      }).catch(err => {
        this.cargandoImagen = false;
        Swal.fire('Error', 'No se pudo subir la imagen', 'error');

      })
  }

  goBack() {
    this.location.back(); // <-- go back to previous location on cancel
  }

}
