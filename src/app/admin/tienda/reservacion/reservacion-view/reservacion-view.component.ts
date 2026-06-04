import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Reservacion } from 'src/app/models/reservacion.model';
import { Usuario } from 'src/app/models/usuario.model';
import { ReservacionService } from 'src/app/services/reservacion.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
declare var bootstrap: any;

@Component({
  selector: 'app-reservacion-view',
  standalone: false,
  templateUrl: './reservacion-view.component.html',
  styleUrl: './reservacion-view.component.css'
})
export class ReservacionViewComponent {

  @Input() reservaSeleccionado;
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  title = "Detalle Reservación";
  public payment: Reservacion[] = [];
  public pago: Reservacion;
  public blogs: any = {};
  public blog: any = {};
  error: string;
  loading = false;

  public paymentForm: FormGroup;
  public usuario: Usuario;
  public pagos: Reservacion;
  user: Usuario;


  public imagenSubir: File;
  public imgTemp: any = null;


  constructor(
    private reservacionService: ReservacionService,
    private http: HttpClient,
    private fb: FormBuilder,
    private usuarioService: UsuarioService,

  ) {
    this.usuario = this.usuarioService.usuario
  }

  ngOnInit(): void {
    this.usuario = JSON.parse(localStorage.getItem('user'));
    this.validarFormulario();
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (
      changes['reservaSeleccionado'] &&
      changes['reservaSeleccionado'].currentValue
    ) {

      this.reservaSeleccionado;
      this.usuario = this.reservaSeleccionado.usuario
      this.blog = this.reservaSeleccionado.blog

      const pago = changes['reservaSeleccionado'].currentValue;
      this.paymentForm.patchValue({
        id: pago._id,
        validacion: pago.validacion,
      });
    }
  }

  onClose() {
    this.reservaSeleccionado = null;
    this.paymentForm.reset();
    this.title = 'Creando Pago';
    // Also reset default values if needed
    this.paymentForm.patchValue({
      id: null,
      status: null,
      validacion: null,
      user_id: null,
    });
    // Emit event to parent to reset the projectSeleccionado variable

    this.closeModal.emit();
  }




  validarFormulario() {
    this.paymentForm = this.fb.group({
      status: ['', Validators.required],
      validacion: ['', Validators.required],
      user_id: [''],
    })
  }

  cargarPayment(_id: string) {
    if (_id !== null && _id !== undefined) {
      this.reservacionService.getReservacionById(_id).subscribe(
        res => {
          this.paymentForm.patchValue({
            id: res._id,
            status: res.status,
          });
          this.reservaSeleccionado = res;
          // console.log(this.reservaSeleccionado);
        }
      );
    }

  }

  get status() {
    return this.paymentForm.get('status');
  }
  get validacion() {
    return this.paymentForm.get('validacion');
  }

  updatePago() {

    const formData = new FormData();
    formData.append('status', this.paymentForm.get('status').value);
    formData.append('validacion', this.paymentForm.get('validacion').value);

    if (this.pago) {
      //actualizar
      const data = {
        ...this.paymentForm.value,
        _id: this.reservaSeleccionado._id
      }
      this.reservacionService.actualizarReservacion(data).subscribe(
        resp => {
          Swal.fire('Actualizado', ` actualizado correctamente`, 'success');
          this.ngOnInit();
        });

    } else {
      return;
    }

  }

}
