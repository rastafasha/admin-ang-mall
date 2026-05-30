import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

import { FileUploadService } from 'src/app/services/file-upload.service';
import { Usuario } from 'src/app/models/usuario.model';
import { CategoriaService } from 'src/app/services/categoria.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { IconosService } from 'src/app/services/iconos.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Tienda } from 'src/app/models/tienda.model';
import { TiendaService } from 'src/app/services/tienda.service';
import { PaisService } from 'src/app/services/pais.service';
import { Pais } from 'src/app/models/pais.model';

interface HtmlInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

declare var jQuery: any;
declare var $: any;

declare var bootstrap: any;

@Component({
  selector: 'app-tiendaadd',
  standalone: false,
  templateUrl: './tiendaadd.component.html',
  styleUrls: ['./tiendaadd.component.css']
})
export class TiendaaddComponent implements OnInit, OnChanges {

  @Input() tiendaSeleccionado;
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
  @Output() refreshTiendaList: EventEmitter<void> = new EventEmitter<void>();

  cargando = false;
  cargandoImagen = false;
  public tiendaForm: FormGroup;
  public tienda: Tienda;
  public usuario: Usuario;
  public imagenSubir: File;
  public imgTemp: any = null;
  public imgHeroTemp: any = null;

  banner: string;
  pageTitle: string;
  listIcons;
  state_banner: boolean;
  currentStep = 1;


  public Editor = ClassicEditor;
  public Editor1 = ClassicEditor;
  public pais?: Pais;
  public paises: Pais;

  public redessociales: any = [];
  public listCategorias: any = [];
  public icono: any;
  description: any;
  name_red: any;
  usuario_red: any;

  nombre: any; local: any;
  categoria: any; subcategorias: any;
  telefono: any; user: any;
  redssociales: any; status: any;

  constructor(
    private fb: FormBuilder,
    private categoriaService: CategoriaService,
    private paisService: PaisService,
    private tiendaService: TiendaService,
    private usuarioService: UsuarioService,
    private fileUploadService: FileUploadService,
    private _iconoService: IconosService,
  ) {
    this.usuario = usuarioService.usuario;
    const base_url = environment.baseUrl;
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    let USER = localStorage.getItem("user");
    this.user = USER ? JSON.parse(USER) : null;
    this.cargar_iconos();
    this.getPaises();
    this.getCategorias();
    this.validarFormulario();
  }

  validarFormulario() {
    this.tiendaForm = this.fb.group({
      nombre: ['', Validators.required],
      local: ['', Validators.required],
      telefono: ['', Validators.required],
      categoria: ['', Validators.required],
      direccion: ['', Validators.required],
      pais: ['', Validators.required],
      moneda: ['', Validators.required],
      ciudad: ['', Validators.required],
      zip: ['', Validators.required],
      subcategoria: [''],
      redssociales: [this.redessociales],
      status: ['Desactivado',],
      state_banner: [false,],
      texto_hero_uno: ['', Validators.required],
      texto_hero_dos: ['', Validators.required],
      texto_hero_destacado: ['', Validators.required],
      descripcion_hero: ['', Validators.required],
      color_primario: ['',],
      color_fondo: ['',],
      isFeatured: [false,],
      user: [this.user.uid],
    })
  }


  ngOnChanges(changes: SimpleChanges): void {

    if (
      changes['tiendaSeleccionado'] &&
      changes['tiendaSeleccionado'].currentValue
    ) {
      this.pageTitle = 'Editando Tienda';
      const tienda = changes['tiendaSeleccionado'].currentValue;
      this.tiendaForm.patchValue({
        id: tienda._id,
        nombre: tienda.nombre,
        local: tienda.local,
        telefono: tienda.telefono,
        categoria: tienda.categoria,
        direccion: tienda.direccion,
        pais: tienda.pais,
        moneda: tienda.moneda,
        ciudad: tienda.ciudad,
        zip: tienda.zip,
        subcategoria: tienda.subcategoria,
        redssociales: tienda.redssociales,
        status: tienda.status,
        state_banner: tienda.state_banner,
        texto_hero_uno: tienda.texto_hero_uno,
        texto_hero_dos: tienda.texto_hero_dos,
        texto_hero_destacado: tienda.texto_hero_destacado,
        descripcion_hero: tienda.descripcion_hero,
        color_primario: tienda.color_primario,
        color_fondo: tienda.color_fondo,
        img: tienda.img,
        img_hero: tienda.img_hero,
        user: tienda.user
      });
      this.tiendaSeleccionado = tienda;
      this.redssociales = this.tiendaSeleccionado.redssociales;
      this.pageTitle = 'Editando Tienda';
    } else {
      this.pageTitle = 'Creando Tienda';
    }
  }

  onClose() {
    this.tiendaSeleccionado = null;
    this.currentStep = 1;
    this.tiendaForm.reset();
    this.pageTitle = 'Creando Tienda';
    // Also reset default values if needed
    this.tiendaForm.patchValue({
      id: null,
      nombre: null,
      local: null,
      telefono: null,
      categoria: null,
      direccion: null,
      pais: null,
      moneda: null,
      ciudad: null,
      zip: null,
      subcategoria: null,
      redssociales: null,
      status: null,
      state_banner: null,
      texto_hero_uno: null,
      texto_hero_dos: null,
      texto_hero_destacado: null,
      descripcion_hero: null,
      color_primario: null,
      color_fondo: null,
      img: null,
      img_hero: null,
      user: null
    });
    // Emit event to parent to reset the projectSeleccionado variable

    this.closeModal.emit();
  }

  nextStep() {
    const nombre = this.tiendaForm.get('nombre');
    const local = this.tiendaForm.get('local');
    const telefono = this.tiendaForm.get('telefono');
    const categoria = this.tiendaForm.get('categoria');
    const direccion = this.tiendaForm.get('direccion');
    const pais = this.tiendaForm.get('pais');
    const moneda = this.tiendaForm.get('moneda');
    const ciudad = this.tiendaForm.get('ciudad');
    const zip = this.tiendaForm.get('zip');
    const subcategoria = this.tiendaForm.get('subcategoria');
    const redssociales = this.tiendaForm.get('redssociales');
    const status = this.tiendaForm.get('status');
    const state_banner = this.tiendaForm.get('state_banner');

    if (nombre?.invalid || local?.invalid ||
      telefono?.invalid || categoria?.invalid ||
      direccion?.invalid || pais?.invalid ||
      moneda?.invalid || ciudad?.invalid ||
      zip?.invalid || subcategoria?.invalid ||
      redssociales?.invalid || status?.invalid ||
      state_banner?.invalid

    ) {
      nombre?.markAsTouched();
      local?.markAsTouched();
      telefono?.markAsTouched();
      categoria?.markAsTouched();
      direccion?.markAsTouched();
      pais?.markAsTouched();
      moneda?.markAsTouched();
      ciudad?.markAsTouched();
      zip?.markAsTouched();
      subcategoria?.markAsTouched();
      redssociales?.markAsTouched();
      status?.markAsTouched();
      state_banner?.markAsTouched();
      this.tiendaForm.markAllAsTouched(); // Esto activa las validaciones visuales
      return;
    }
    this.currentStep = 2;


  }
  nextStepApp() {
    const texto_hero_uno = this.tiendaForm.get('texto_hero_uno');
    const texto_hero_dos = this.tiendaForm.get('texto_hero_dos');
    const texto_hero_destacado = this.tiendaForm.get('texto_hero_destacado');
    const descripcion_hero = this.tiendaForm.get('descripcion_hero');
    const color_primario = this.tiendaForm.get('color_primario');
    const color_fondo = this.tiendaForm.get('color_fondo');

    if (texto_hero_uno?.invalid || texto_hero_dos?.invalid ||
      texto_hero_destacado?.invalid || descripcion_hero?.invalid ||
      color_primario?.invalid || color_fondo?.invalid

    ) {
      texto_hero_uno?.markAsTouched();
      texto_hero_dos?.markAsTouched();
      texto_hero_destacado?.markAsTouched();
      descripcion_hero?.markAsTouched();
      color_primario?.markAsTouched();
      color_fondo?.markAsTouched();
      this.tiendaForm.markAllAsTouched(); // Esto activa las validaciones visuales
      return;
    }
    this.currentStep = 3;
  }



  prevStep() {
    this.currentStep = 1;
  }

  prevStep2() {
    this.currentStep = 2;
  }




  getCategorias() {
    this.categoriaService.cargarCategorias().subscribe(
      resp => {
        this.listCategorias = resp;
      }
    )
  }

  getPaises() {
    this.paisService.getPaises().subscribe(
      resp => {
        this.paises = resp;
      }
    )
  }

  // addRedSocial
  addRedSocial() {
    if (this.redssociales) {
      this.redssociales.push({
        index: this.redssociales.length + 1,
        name_red: this.name_red,
        usuario_red: this.usuario_red,
        icono: this.icono
      });
    } else {
      this.redssociales = [
        {
          index: 1, // initial index
          name_red: this.name_red,
          usuario_red: this.usuario_red,
          icono: this.icono
        },
      ];
    }
    this.name_red = '';
    this.usuario_red = '';
    this.icono = '';
  }

  deleteMedical(i: any) {
    this.redssociales.splice(i, 1);
  }

  cargar_iconos() {
    this._iconoService.getIconsSocial().subscribe(
      (resp: any) => {
        this.listIcons = resp.iconos;
      }
    )
  }
  // addRedSocial

  saveTienda() {
    this.cargando = true;
    if (!this.tiendaForm.valid) {
      //mostramos las alertas de los campos requeridos
      this.tiendaForm.markAllAsTouched(); // Esto activa las validaciones visuales
      return
    }

    const {
      nombre,
      local,
      telefono,
      categoria,
      direccion,
      pais,
      ciudad,
      moneda,
      zip,
      subcategoria,
      redssociales,
      status,
      state_banner,
      isFeatured,
      user,
    } = this.tiendaForm.value;

    if (this.tiendaSeleccionado) {
      //actualizar
      const data = {
        ...this.tiendaForm.value,
        user: this.user.uid,
        _id: this.tiendaSeleccionado._id,
        // user: this.usuario.uid
      }
      this.tiendaService.actualizarTienda(data).subscribe(
        resp => {
          this.cargando = false;
          Swal.fire('Actualizado', `${nombre} actualizado correctamente, Ahora Agrega la info para el menu y sube la imagen.`, 'success');
          // Close modal programmatically
          // const modalElement = document.getElementById('editTienda');
          // const modal = bootstrap.Modal.getInstance(modalElement);
          // if (modal) {
          //   modal.hide();

          // }
          // // Emit event to refresh project list
          // this.refreshTiendaList.emit();
          // this.ngOnInit()
        });

    } else {
      //crear
      this.tiendaService.crearTienda(this.tiendaForm.value)
        .subscribe((resp: any) => {
          this.cargando = false;
          this.tiendaSeleccionado = resp.tienda;
          Swal.fire('¡Paso 1 completado!', 'Tienda creada. Ahora Agrega la info para el menu y sube la imagen.', 'success');
          // Como estmos creando, al finalizar debe ir al paso 2 para subir la imagen
          this.currentStep = 2;
        })
    }

  }


  cambiarImagen(file: File, campo: 'img' | 'img_hero') {
  this.imagenSubir = file;

  if (!file) {
    if (campo === 'img_hero') {
      return this.imgHeroTemp = null;
    } else {
      return this.imgTemp = null;
    }
  }

  const reader = new FileReader();
  
  // Solo ejecutamos el método (sin asignarlo a una constante)
  reader.readAsDataURL(file);

  reader.onloadend = () => {
    // Asignamos la vista previa al campo correspondiente de forma independiente
    if (campo === 'img_hero') {
      this.imgHeroTemp = reader.result;
    } else {
      this.imgTemp = reader.result;
    }
  }
}


  // 🛠️ Ahora la función recibe si es 'img' o 'img_hero'
  subirImagen(campo: 'img' | 'img_hero') {
  if (!this.imagenSubir) {
    Swal.fire('Atención', 'Por favor, selecciona una imagen primero', 'warning');
    return;
  }

  this.cargandoImagen = true;

  // PASAMOS EL CAMPO AL SERVICIO
  this.fileUploadService.actualizarFoto(this.imagenSubir, 'locaciones', this.tiendaSeleccionado._id, campo)
    .then(img => {
      if (campo === 'img_hero') {
        this.tiendaSeleccionado.img_hero = img;
      } else {
        this.tiendaSeleccionado.img = img;
      }

      this.cargandoImagen = false;
      this.imgTemp = null; 
      Swal.fire('Guardado', 'La imagen fue actualizada y optimizada', 'success');

    }).catch(err => {
      this.cargandoImagen = false;
      Swal.fire('Error', 'No se pudo subir la imagen', 'error');
    });
}

}
