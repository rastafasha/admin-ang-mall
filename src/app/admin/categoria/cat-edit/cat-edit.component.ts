import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { Categoria } from 'src/app/models/categoria.model';
import { Usuario } from 'src/app/models/usuario.model';
import { CategoriaService } from 'src/app/services/categoria.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { IconosService } from 'src/app/services/iconos.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { TranslateService } from '@ngx-translate/core';
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
  user:any;

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
    private translate: TranslateService,
    private _iconoService: IconosService,
  ) {
    this.usuario = usuarioService.usuario;
    const base_url = environment.baseUrl;
  }

  ngOnInit(): void {
    let USER = localStorage.getItem("user");
    this.user = JSON.parse(USER ? USER : '');
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
      // Detectamos el idioma actual del sistema
const lang = this.translate.currentLang || 'es';

this.categoriaForm.patchValue({
  id: categoria._id,
  
  // 1. Extrae el texto del idioma actual (con respaldo en español por si viene vacío)
  nombre: categoria.nombre?.[lang] || categoria.nombre?.es || '',
  
  // 2. Hace lo mismo para la subcategoría protegiendo el código contra textos planos viejos
  subcategorias: typeof categoria.subcategorias === 'object' 
    ? (categoria.subcategorias?.[lang] || categoria.subcategorias?.es || '')
    : (categoria.subcategorias || ''), // Por si queda algún registro viejo sin migrar
    
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
    this.pageTitle = 'Creando Producto';
    
    // 1. Reseteamos el formulario pasándole los valores iniciales limpios de un solo golpe
    this.categoriaForm.reset({
      id: null,
      nombre: '',
      subcategorias: '',
      icono: '',
      state_banner: false, // Inicializa los booleanos en false
      
    });

    // 2. 🚀 LA CLAVE: Forzamos a Angular a limpiar los estados de validación visuales (los bordes rojos/verdes)
    this.categoriaForm.markAsPristine();
    this.categoriaForm.markAsUntouched();
    this.categoriaForm.updateValueAndValidity();

    // Emitimos el evento al padre para limpiar cualquier variable externa
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
      this.categoriaForm.markAllAsTouched(); 
      return;
    }

    const { nombre } = this.categoriaForm.value;

    // 1. Extraemos el ID de la tienda directamente del usuario logueado
    // (Ajusta a 'this.usuario.local._id' si 'local' viene como un objeto completo en tu app)
    const localId = this.user.local?._id || this.user.local;

    if (!localId) {
      Swal.fire('Error', 'No se pudo determinar la tienda asociada a tu usuario.', 'error');
      return;
    }

    if (this.categoriaSeleccionado) {
      // ACTUALIZAR
      const data = {
        ...this.categoriaForm.value,
        _id: this.categoriaSeleccionado._id,
        local: localId // 🟢 Inyectamos el ID de la tienda del usuario
      }
      this.categoriaService.actualizarCategoria(data).subscribe(
        resp => {
          Swal.fire('Actualizado', `${nombre} actualizado correctamente`, 'success');
          const modalElement = document.getElementById('editCategoria');
          const modal = bootstrap.Modal.getInstance(modalElement);
          if (modal) {
            modal.hide();
          }
          this.refreshCatList.emit();
          this.ngOnInit();
        });

    } else {
      // CREAR
      const nuevaCategoriaData = {
        ...this.categoriaForm.value,
        local: localId // 🟢 Inyectamos el ID de la tienda del usuario
      };

      this.categoriaService.crearCategoria(nuevaCategoriaData)
        .subscribe((resp: any) => {
          this.categoriaSeleccionado = resp.categoria;
          Swal.fire('¡Paso 1 completado!', 'Post creado. Ahora sube la imagen.', 'success');
          this.currentStep = 2;
        });
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


  
}
