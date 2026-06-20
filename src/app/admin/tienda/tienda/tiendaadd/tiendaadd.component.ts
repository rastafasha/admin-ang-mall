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
import { TranslateService } from '@ngx-translate/core';

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

  public typeof = (val: any) => typeof val;

  constructor(
    private fb: FormBuilder,
    private categoriaService: CategoriaService,
    private paisService: PaisService,
    private tiendaService: TiendaService,
    private usuarioService: UsuarioService,
    private fileUploadService: FileUploadService,
    private _iconoService: IconosService,
    public translate: TranslateService,
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
      direccion: ['', Validators.required],
      pais: ['', Validators.required],

      // 🔑 MODIFICADO: Dejamos 'USD' por defecto para tus clientes tradicionales
      moneda: ['USD', Validators.required],

      // 🔑 NUEVOS CAMPOS INTERNACIONALES OPERATIVOS
      tipoFlujo: ['WHATSAPP', Validators.required], // Nace híbrido por defecto
      acepta_usd_internacional: [false],
      acepta_eur: [false],

      ciudad: ['', Validators.required],
      zip: ['', Validators.required],
      categoria: [''],
      subcategoria: [''],
      redessociales: [this.redessociales],
      status: ['Desactivado',],
      state_banner: [false,],
      mostrarTasas: [false,],
      usaDelivery: [false,],
      has_reservacion: [false,],
      capacidad_por_hora: [''],
      texto_hero_uno: [''],
      texto_hero_dos: [''],
      texto_hero_destacado: [''],
      descripcion_hero: [''],
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
      // Detectamos el idioma actual del sistema ('es' o 'en')
      const lang = this.translate.currentLang || 'es';

      this.tiendaForm.patchValue({
        id: tienda._id,

        // 1. Textos de Marketing/Hero bilingües (extrae el idioma activo con respaldo en español)
        texto_hero_uno: tienda.texto_hero_uno?.[lang] || tienda.texto_hero_uno?.es || '',
        texto_hero_dos: tienda.texto_hero_dos?.[lang] || tienda.texto_hero_dos?.es || '',
        texto_hero_destacado: tienda.texto_hero_destacado?.[lang] || tienda.texto_hero_destacado?.es || '',
        descripcion_hero: tienda.descripcion_hero?.[lang] || tienda.descripcion_hero?.es || '',

        // 2. Manejo seguro de subcategoría (por si viene como objeto bilingüe o texto plano)
        subcategoria: typeof tienda.subcategoria === 'object'
          ? (tienda.subcategoria?.[lang] || tienda.subcategoria?.es || '')
          : (tienda.subcategoria || ''),

        // 3. Selectores de relación (ID limpio para que el <select> se active)
        categoria: tienda.categoria?._id || tienda.categoria || '',

        // 4. Campos administrativos, de configuración y de contacto (se quedan exactamente igual)
        nombre: tienda.nombre,
        local: tienda.local,
        telefono: tienda.telefono,
        direccion: tienda.direccion,
        pais: tienda.pais,
        moneda: tienda.moneda || 'USD', // Aseguramos un respaldo por si acaso
        ciudad: tienda.ciudad,
        zip: tienda.zip,
        status: tienda.status,
        mostrarTasas: tienda.mostrarTasas,
        usaDelivery: tienda.usaDelivery,
        state_banner: tienda.state_banner,
        has_reservacion: tienda.has_reservacion,
        capacidad_por_hora: tienda.capacidad_por_hora,
        color_primario: tienda.color_primario,
        color_fondo: tienda.color_fondo,
        img: tienda.img,
        img_hero: tienda.img_hero,
        user: tienda.user?._id || tienda.user || '', // Por si el objeto de usuario viene poblado

        // 🔑 5. INYECCIÓN DE CONTROL INTERNACIONAL AL EDITAR
        // Sincroniza los selectores y switches de tu HTML con la base de datos migrada
        tipoFlujo: tienda.tipoFlujo || 'WHATSAPP',
        acepta_usd_internacional: tienda.acepta_usd_internacional || false,
        acepta_eur: tienda.acepta_eur || false
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
      moneda: 'USD', // 🔑 Resetea al valor internacional por defecto
      ciudad: null,
      zip: null,
      subcategoria: null,
      redssociales: null,
      status: null,
      mostrarTasas: null,
      usaDelivery: null,
      state_banner: null,
      has_reservacion: null,
      texto_hero_uno: null,
      texto_hero_dos: null,
      texto_hero_destacado: null,
      descripcion_hero: null,
      color_primario: null,
      color_fondo: null,
      img: null,
      img_hero: null,
      user: null,

      // 🔑 NUEVA LIMPIEZA INTERNACIONAL:
      // Setea los valores base de fábrica para que el formulario nazca limpio para Venezuela
      tipoFlujo: 'WHATSAPP',
      acepta_usd_internacional: false,
      acepta_eur: false
    });
    // Emit event to parent to reset the projectSeleccionado variable

    this.closeModal.emit();
}


  nextStep() {
    const nombre = this.tiendaForm.get('nombre');
    const local = this.tiendaForm.get('local');
    const telefono = this.tiendaForm.get('telefono');

    const direccion = this.tiendaForm.get('direccion');
    const pais = this.tiendaForm.get('pais');
    const tipoFlujo = this.tiendaForm.get('tipoFlujo');
    const moneda = this.tiendaForm.get('moneda');
    const ciudad = this.tiendaForm.get('ciudad');
    const zip = this.tiendaForm.get('zip');
    const mostrarTasas = this.tiendaForm.get('mostrarTasas');
    const usaDelivery = this.tiendaForm.get('usaDelivery');

    const status = this.tiendaForm.get('status');
    const state_banner = this.tiendaForm.get('state_banner');
    const has_reservacion = this.tiendaForm.get('has_reservacion');

    if (nombre?.invalid || local?.invalid ||
      telefono?.invalid ||
      direccion?.invalid || pais?.invalid ||
      tipoFlujo?.invalid || ciudad?.invalid ||
      zip?.invalid || status?.invalid ||
      moneda?.invalid ||
      mostrarTasas?.invalid ||
      usaDelivery?.invalid ||
      state_banner?.invalid ||
      has_reservacion?.invalid

    ) {
      nombre?.markAsTouched();
      local?.markAsTouched();
      telefono?.markAsTouched();
      direccion?.markAsTouched();
      pais?.markAsTouched();
      tipoFlujo?.markAsTouched();
      moneda?.markAsTouched();
      mostrarTasas?.markAsTouched();
      usaDelivery?.markAsTouched();
      ciudad?.markAsTouched();
      zip?.markAsTouched();
      status?.markAsTouched();
      state_banner?.markAsTouched();
      has_reservacion?.markAsTouched();
      this.tiendaForm.markAllAsTouched(); // Esto activa las validaciones visuales
      return;
    }
    this.currentStep = 2;
  }

  nextStep2() {
    this.currentStep = 3;
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
    this.currentStep = 4;
  }



  prevStep1() {
    this.currentStep = 1;
  }
  prevStep() {
    this.currentStep = 2;
  }

  prevStep2() {
    this.currentStep = 3;
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
      tipoFlujo,
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
      const data = {
        ...this.tiendaForm.value,
        user: this.user.uid,
        redssociales: this.redssociales,
        // user: this.usuario.uid
      }
      this.tiendaService.crearTienda(data)
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
