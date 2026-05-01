import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Producto } from 'src/app/models/producto.model';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { GaleriaService } from 'src/app/services/galeria.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../../services/usuario.service';
import { ProductoService } from 'src/app/services/producto.service';
import { FormGroup } from '@angular/forms';
declare var jQuery: any;
declare var $: any;

declare var bootstrap: any;

@Component({
  selector: 'app-galeria-producto',
  standalone: false,
  templateUrl: './galeria-producto.component.html',
  styleUrls: ['./galeria-producto.component.css']
})
export class GaleriaProductoComponent implements OnInit, OnChanges {

  @Input() productoSeleccionado;
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
  @Output() refreshProductList: EventEmitter<void> = new EventEmitter<void>();

  public id;
  public imagenes: any = [];
  public files: File[] = [];
  public msm_error = false;
  public url;
  public count_img;
  public identity;

  public galerias: any;
  public galeria: Array<any> = [];
  public select_producto;
  public first_img;

  public imgSelect: String | ArrayBuffer;
  public producto: Producto;
  public imagenSubir: File;
  pageTitle: string;
  public galeriaForm: FormGroup;
  isLoadingImage = false;


  p: number = 1;
  count: number = 8;

  constructor(
    private galeriaService: GaleriaService,
    private _router: Router,
    private _userService: UsuarioService,
    private fileUploadService: FileUploadService,
    private activatedRoute: ActivatedRoute,
    private productoService: ProductoService,

  ) {
    this.url = environment.baseUrl;
    this.identity = this._userService.usuario;
  }

  ngOnInit(): void {

  }

ngOnChanges(changes: SimpleChanges): void {

    if (
      changes['productoSeleccionado'] &&
      changes['productoSeleccionado'].currentValue
    ) {
      this.pageTitle = 'Editando Galería';
      const producto = changes['productoSeleccionado'].currentValue;

      // Clear galeria array first to avoid duplicates
      this.galeria = [];
      
      this.galeriaService.find_by_product(this.productoSeleccionado._id).subscribe(
      response => {
        response.galeria.forEach((element, index) => {
          if (index == 0) {
            this.first_img = element.imagen;
          }
          this.galeria.push({ _id: element._id, imagen: element.imagen });
        });
      }
    );
      this.productoSeleccionado = producto;
      this.pageTitle = 'Editando Galería';
    } else {
      this.pageTitle = 'Creando Galería';
    }
    // this.listar();
  }

// Method to reset all modal state
  resetModal() {
    // Clear files array
    this.files = [];
    // Clear and reinitialize galeria array
    this.galeria = [];
    // Reset imagenSubir
    this.imagenSubir = undefined;
    // Reset error message
    this.msm_error = false;
    // Reset pagination to first page
    this.p = 1;
  }

  onClose() {
    // Reset all modal state first
    this.resetModal();
    
    this.productoSeleccionado = null;
    this.pageTitle = 'Creando Galería';
    
    // Emit event to parent to reset the projectSeleccionado variable
    this.refreshProductList.emit();
    this.closeModal.emit();

  }


  close_alert() {
    this.msm_error = false;
  }

  onSelect(event) {
    this.files.push(...event.addedFiles);

  }

  onRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
  }

get_galeria() {
    // Clear galeria array first to avoid duplicates
    this.galeria = [];
    this.galeriaService.find_by_product(this.productoSeleccionado._id).subscribe(
      response => {
        response.galeria.forEach((element, index) => {
          if (index == 0) {
            this.first_img = element.imagen;
          }
          this.galeria.push({ _id: element._id, imagen: element.imagen });
        });
      }
    );
  }

  listar() {
    this.galeriaService.get_cupon(this.productoSeleccionado._id).subscribe(
      (response: any) => {
        this.imagenes = response.imagenes;
        this.count_img = this.imagenes.length;
      })
  }

onSubmit() {
    const formData = new FormData();
    this.files.forEach(file => {
      formData.append('imagenes', file);
    });
    formData.append('producto', this.productoSeleccionado._id);

    if (this.productoSeleccionado) {
      this.galeriaService.registro(formData).subscribe(
        (response:any) => {
          this.subirImagen();
          this.get_galeria();
          // Refresh modal after submit
          this.resetModal();
        },
        error => {
          this.msm_error = true;
        }
      );
    }

  }

eliminar(item: any){
      Swal.fire({
        title: 'Borrar imagen?',
        text: `Estar a punto de borrar a ${item.imagen}`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Si, borrar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.galeriaService.eliminar(item).subscribe(
            resp => {
              this.get_galeria();
              // Reset pagination after delete
              this.p = 1;
              Swal.fire(
                'imagen Borrado',
                `la imagen ${item.imagen} ha sido borrado correctamente`,
                'success'
                 );
            });
        }
      })
    }

  subirImagen() {
    this.isLoadingImage = true;
    this.fileUploadService
      .actualizarFoto(this.imagenSubir, 'galerias', this.productoSeleccionado._id)
      .then(img => {
        this.productoSeleccionado.img = img;
        this.isLoadingImage = false;
        Swal.fire('Guardado', 'La imagen fue actualizada', 'success');

      }).catch(err => {
        this.isLoadingImage = false;
        Swal.fire('Error', 'No se pudo subir la imagen', 'error');

      })
  }

}
