import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';
import { CategoriaService } from 'src/app/services/categoria.service';
import { MarcaService } from 'src/app/services/marca.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { Producto } from 'src/app/models/producto.model';
import { ProductoService } from 'src/app/services/producto.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ColorService } from 'src/app/services/color.service';
import { SelectorService } from 'src/app/services/selector.service';
import { TiendaService } from 'src/app/services/tienda.service';
import { TranslateService } from '@ngx-translate/core';
interface HtmlInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

declare var jQuery: any;
declare var $: any;

declare var bootstrap: any;

@Component({
  selector: 'app-prod-edit',
  standalone: false,
  templateUrl: './prod-edit.component.html',
  styleUrls: ['./prod-edit.component.css'],
  providers: [
    MarcaService,
    CategoriaService
  ]
})
export class ProdEditComponent implements OnInit, OnChanges {

  @Input() productoSeleccionado;
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
  @Output() refreshProductList: EventEmitter<void> = new EventEmitter<void>();

  public productoForm: FormGroup;
  public producto: Producto;
  public usuario: Usuario;
  public imagenSubir: File;
  public imgTemp: any = null;
  public file: File;
  public imgSelect: String | ArrayBuffer;
  public listMarcas;
  public listCategorias;
  public colores: any;
  public color_to_cart: any;
  public selectores: any;
  cargando = false;
  cargandoImagen = false;
  currentStep = 1;

  banner: string;
  pageTitle: string;
  producto_id: any;
  listTiendas: any;
  localList: any[];

  public Editor = ClassicEditor;
  public Editor1 = ClassicEditor;

  user: any;
 public typeof = (val: any) => typeof val;
  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private usuarioService: UsuarioService,
    private marcaService: MarcaService,
    private categoriaService: CategoriaService,
    private tiendaService: TiendaService,
    private fileUploadService: FileUploadService,
    public translate: TranslateService,
    private _colorService: ColorService,
    private _selectorService: SelectorService,
    private sanitizer: DomSanitizer,

  ) {
    this.usuario = usuarioService.usuario;
  }

  ngOnInit(): void {
    let USER = localStorage.getItem("user");
    this.user = JSON.parse(USER ? USER : '');

    this.validarFormulario();
    this.getMarca();
    if (this.user.role === 'SUPERADMIN') {
      this.loadCategorias();
    }

    if (this.user.role === 'ADMIN' || this.user.role === 'VENTAS' || this.user.role === 'TIENDA' || this.user.role === 'ALMACEN') {
      this.loadCategoriasLocal();
    }
    this.cargar_Locales();
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (
      changes['productoSeleccionado'] &&
      changes['productoSeleccionado'].currentValue
    ) {
      this.pageTitle = 'Editando Producto';
      const producto = changes['productoSeleccionado'].currentValue;
      // Detectamos el idioma actual del sistema ('es' o 'en')
      const lang = this.translate.currentLang || 'es';

      this.productoForm.patchValue({
        id: producto._id,

        // 1. Campos de texto bilingües (extrae el idioma activo con respaldo en español)
        titulo: producto.titulo?.[lang] || producto.titulo?.es || '',
        detalle: producto.detalle?.[lang] || producto.detalle?.es || '',
        info_short: producto.info_short?.[lang] || producto.info_short?.es || '',

        // 2. Selectores de relación (asumiendo que llega el objeto poblado o solo el ID)
        // Pasamos solo el _id para que el elemento <select> de Bootstrap/Angular se active correctamente
        categoria: producto.categoria?._id || producto.categoria || '',

        // Manejo seguro de subcategoría por si viene como objeto bilingüe o string plano
        subcategoria: typeof producto.subcategoria === 'object'
          ? (producto.subcategoria?.[lang] || producto.subcategoria?.es || '')
          : (producto.subcategoria || ''),

        // 3. Campos planos, numéricos y de control (se quedan exactamente igual)
        slug: producto.slug,
        video_review: producto.video_review,
        stock: producto.stock,
        sku: producto.sku,
        precio_ahora: producto.precio_ahora,
        precio_antes: producto.precio_antes,
        isFeatured: producto.isFeatured,
        marca: producto.marca,
        local: producto.local?._id || producto.local || '', // Por si local viene poblado
        nombre_selector: producto.nombre_selector,
        img: producto.img
      });

      this.productoSeleccionado = producto;
      this.pageTitle = 'Editando Producto';
    } else {
      this.pageTitle = 'Creando Producto';
    }
  }

  onClose() {
    this.productoSeleccionado = null;
    this.currentStep = 1;
    this.pageTitle = 'Creando Producto';

    // 1. Reseteamos el formulario pasándole los valores iniciales limpios de un solo golpe
    this.productoForm.reset({
      id: null,
      titulo: '',
      slug: '',
      detalle: '',
      info_short: '',
      video_review: '',
      stock: 0, // Es mejor inicializar numéricos en 0 para evitar errores de validación
      sku: '',
      precio_ahora: null,
      precio_antes: null,
      categoria: '',
      subcategoria: '',
      isFeatured: false, // Inicializa los booleanos en false
      marca: '',
      local: this.usuario?.local || '', // Mantenemos el local de tu usuario express
      nombre_selector: 'unico', // Tu valor por defecto estándar
      img: null
    });

    // 2. 🚀 LA CLAVE: Forzamos a Angular a limpiar los estados de validación visuales (los bordes rojos/verdes)
    this.productoForm.markAsPristine();
    this.productoForm.markAsUntouched();
    this.productoForm.updateValueAndValidity();

    // Emitimos el evento al padre para limpiar cualquier variable externa
    this.closeModal.emit();
  }


  nextStep() {
    const titulo = this.productoForm.get('titulo');
    const detalle = this.productoForm.get('detalle');
    const info_short = this.productoForm.get('info_short');
    const video_review = this.productoForm.get('video_review');
    const slug = this.productoForm.get('slug');
    const sku = this.productoForm.get('sku');
    const stock = this.productoForm.get('stock');
    const precio_ahora = this.productoForm.get('precio_ahora');
    const precio_antes = this.productoForm.get('precio_antes');
    const categoria = this.productoForm.get('categoria');
    const subcategoria = this.productoForm.get('subcategoria');
    const isFeatured = this.productoForm.get('isFeatured');
    const marca = this.productoForm.get('marca');
    const local = this.productoForm.get('local');
    const nombre_selector = this.productoForm.get('nombre_selector');

    if (titulo?.invalid || detalle?.invalid ||
      info_short?.invalid || video_review?.invalid ||
      slug?.invalid || sku?.invalid ||
      stock?.invalid || precio_ahora?.invalid ||
      precio_antes?.invalid || categoria?.invalid ||
      subcategoria?.invalid || isFeatured?.invalid ||
      marca?.invalid || local?.invalid ||
      nombre_selector?.invalid

    ) {
      titulo?.markAsTouched();
      detalle?.markAsTouched();
      info_short?.markAsTouched();
      video_review?.markAsTouched();
      slug?.markAsTouched();
      sku?.markAsTouched();
      stock?.markAsTouched();
      precio_ahora?.markAsTouched();
      precio_antes?.markAsTouched();
      categoria?.markAsTouched();
      subcategoria?.markAsTouched();
      isFeatured?.markAsTouched();
      marca?.markAsTouched();
      local?.markAsTouched();
      nombre_selector?.markAsTouched();
      return;
    }
    this.currentStep = 2;
  }

  prevStep() {
    this.currentStep = 1;
  }

  validarFormulario() {
    this.productoForm = this.fb.group({
      titulo: ['', Validators.required],
      detalle: ['', Validators.required],
      info_short: ['', Validators.required],
      video_review: [''],
      slug: [''],
      sku: ['', Validators.required],
      stock: ['', Validators.required],
      precio_ahora: ['', Validators.required],
      precio_antes: ['', Validators.required],
      categoria: ['', Validators.required],
      subcategoria: [''],
      isFeatured: [''],
      marca: [''],
      local: [''],
      nombre_selector: ['', Validators.required]
    })
  }


  listConfig() {
    this._colorService.colorByProduct(this.producto_id).subscribe(
      (resp: any) => {
        console.log(resp);
        // this.colores = resp;
        // this.color_to_cart = this.colores[0].color;

      },
      error => {

      }
    );

    this._selectorService.selectorByProduct(this.producto_id).subscribe(
      response => {
        this.selectores = response;
        console.log(response);

      },
      error => {

      }
    );
  }
  getMarca() {
    this.marcaService.cargarMarcas().subscribe(
      resp => {
        this.listMarcas = resp;
        // console.log(this.listMarcas)

      }
    )
  }

  loadCategorias() {
    this.categoriaService.getCategoriesActivas().subscribe(
      resp => {
        this.listCategorias = resp;
        // console.log(this.listCategorias);

      }
    )
  }

  loadCategoriasLocal() {
    this.categoriaService.getCategoriaByLocal(this.user.local).subscribe(
      categorias => {
        this.listCategorias = categorias;
      }
    )

  }

  cargar_Locales() {
    this.tiendaService.cargarTiendas().subscribe(
      (resp: any) => {
        this.listTiendas = resp;
      }
    )
  }


  updateProducto() {
    this.cargando = true;
    if (!this.productoForm.valid) {
      //mostramos las alertas de los campos requeridos
      this.productoForm.markAllAsTouched(); // Esto activa las validaciones visuales
      return
    }


    const { titulo, precio_antes, info_short, detalle,
      stock, categoria, subcategoria, sku,
      nombre_selector, marca,
      video_review, precio_ahora,
      isFeatured, local
    } = this.productoForm.value;

    // Determinar el valor de local según el rol del usuario
    const localValue = this.user.role === 'SUPERADMIN' ? this.localList : this.user.local;

    if (this.productoSeleccionado) {
      //actualizar
      const data = {
        ...this.productoForm.value,
        _id: this.productoSeleccionado._id,
        local: localValue
      }


      this.productoService.actualizarProducto(data).subscribe(
        resp => {
          this.cargando = false;
          Swal.fire('Actualizado', `${titulo}  actualizado correctamente`, 'success');
          // Close modal programmatically
          const modalElement = document.getElementById('editProducto');
          const modal = bootstrap.Modal.getInstance(modalElement);
          if (modal) {
            modal.hide();

          }
          // Emit event to refresh project list
          this.refreshProductList.emit();
          this.ngOnInit()
        });

    } else {
      //crear
      const data = {
        ...this.productoForm.value,
        local: localValue
      }
      this.productoService.crearProducto(data)
        .subscribe((resp: any) => {
          this.cargando = false;
          this.productoSeleccionado = resp.producto;
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
      .actualizarFoto(this.imagenSubir, 'productos', this.productoSeleccionado._id)
      .then(img => {
        this.productoSeleccionado.img = img;
        this.cargandoImagen = false;
        Swal.fire('Guardado', 'La imagen fue actualizada', 'success');

      }).catch(err => {
        this.cargandoImagen = false;
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
