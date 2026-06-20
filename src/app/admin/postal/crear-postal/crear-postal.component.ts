import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Postal } from 'src/app/models/postal.model';
import { PostalService } from 'src/app/services/postal.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
declare var bootstrap: any;
@Component({
  selector: 'app-crear-postal',
  standalone: false,
  templateUrl: './crear-postal.component.html',
  styleUrl: './crear-postal.component.css'
})
export class CrearPostalComponent {

  @Input() postalSeleccionado;
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
  @Output() refreshPostalList: EventEmitter<void> = new EventEmitter<void>();

  public postalForm: FormGroup;
  public postal: Postal;
  public imagenSubir: File;
  public imgTemp: any = null;
  user: any;

  banner: string;
  pageTitle: string;
  listIcons;
  state_banner: boolean;

  constructor(
    private fb: FormBuilder,
    private postalService: PostalService,
    private translate: TranslateService,
  ) {
  }

  ngOnInit(): void {
    let USER = localStorage.getItem("user");
    this.user = JSON.parse(USER ? USER : '');
    window.scrollTo(0, 0);
    this.validarFormulario();
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (
      changes['postalSeleccionado'] &&
      changes['postalSeleccionado'].currentValue
    ) {
      this.pageTitle = 'Editando Delivery';
      const postal = changes['postalSeleccionado'].currentValue;
      // Detectamos el idioma actual del sistema
      const lang = this.translate.currentLang || 'es';

      this.postalForm.patchValue({
        id: postal._id,
        titulo: postal.titulo,
        tiempo: postal.tiempo,
        precio: postal.precio,
        distancia: postal.distancia,
      });

      this.postalSeleccionado = postal;
      this.pageTitle = 'Editando Delivery';
    } else {
      this.pageTitle = 'Creando Delivery';
    }
  }

  onClose() {
    this.postalSeleccionado = null;
    this.pageTitle = 'Creando Delivery';

    // 1. Reseteamos el formulario pasándole los valores iniciales limpios de un solo golpe
    this.postalForm.reset({
      id: null,
      titulo: '',
      tiempo: '',
      precio: '',
      distancia: '', // Inicializa los booleanos en false

    });

    // 2. 🚀 LA CLAVE: Forzamos a Angular a limpiar los estados de validación visuales (los bordes rojos/verdes)
    this.postalForm.markAsPristine();
    this.postalForm.markAsUntouched();
    this.postalForm.updateValueAndValidity();

    // Emitimos el evento al padre para limpiar cualquier variable externa
    this.closeModal.emit();
  }

  validarFormulario() {
    this.postalForm = this.fb.group({
      titulo: ['', Validators.required],
      tiempo: ['', Validators.required],
      precio: ['', Validators.required],
      distancia: ['', Validators.required],
    })
  }

  onSubmit() {

    if (!this.postalForm.valid) {
      this.postalForm.markAllAsTouched();
      return;
    }

    const { titulo } = this.postalForm.value;

    const localId = this.user.local?._id || this.user.local;

    if (!localId) {
      Swal.fire('Error', 'No se pudo determinar la tienda asociada a tu usuario.', 'error');
      return;
    }

    if (this.postalSeleccionado) {
      // ACTUALIZAR
      const data = {
        ...this.postalForm.value,
        _id: this.postalSeleccionado._id,
        local: localId
      }
      this.postalService.actualizarPostal(data).subscribe(
        resp => {
          const modalElement = document.getElementById('editPostal');
          if (modalElement) {
            const modalInstance = (window as any).bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) {
              modalInstance.hide();
            }
          }
          this.onClose();
          // 💡 SOLUCIÓN: Damos 300ms a Bootstrap para que limpie el fondo gris antes de destruir el componente con emit()
          setTimeout(() => {
            // Parche de fuerza bruta si Bootstrap no logra borrar su propia cortina:
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) backdrop.remove();
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';

            this.refreshPostalList.emit();
          }, 300);
          
        });

    } else {
      // CREAR
      const nuevaCategoriaData = {
        ...this.postalForm.value,
        local: localId
      };

      this.postalService.registro(nuevaCategoriaData)
        .subscribe((resp: any) => {
          this.postalSeleccionado = resp.postal;
          const modalElement = document.getElementById('editPostal');
          if (modalElement) {
            const modalInstance = (window as any).bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) {
              modalInstance.hide();
            }
          }
          this.onClose();
          // 💡 SOLUCIÓN: Lo mismo aquí para la creación
          setTimeout(() => {
            // Parche de fuerza bruta si Bootstrap no logra borrar su propia cortina:
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) backdrop.remove();
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';

            this.refreshPostalList.emit();
          }, 300);
        });
    }
  }






}
