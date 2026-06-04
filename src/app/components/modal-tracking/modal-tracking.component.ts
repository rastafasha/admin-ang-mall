import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

declare var bootstrap: any;

@Component({
  selector: 'app-modal-tracking',
  standalone:false,
  templateUrl: './modal-tracking.component.html',
  styleUrl: './modal-tracking.component.css'
})
export class ModalTrackingComponent {
  @ViewChild('modalContenedor', { static: false }) modalContenedor!: ElementRef;
  @Output() onGuardarTrack = new EventEmitter<any>();
  @Input() item:any
  @Input() tienda_moneda:any
  @Input() setTrack:any;


  // Declaramos otras variables que usas en tu formulario
  public track: string = '';
  public msm_error_track: boolean = false;
  // Guardamos la instancia aquí para poder cerrarla después
  private bModal: any;

   // Esta función es llamada desde el padre
  mostrarModal() {
  setTimeout(() => {
    if (this.modalContenedor && this.modalContenedor.nativeElement) {
      // Inicializa el modal usando la referencia directa de Angular
      this.bModal = new bootstrap.Modal(this.modalContenedor.nativeElement, {
        keyboard: true
      });
      this.bModal.show();
    } else {
      console.error('El contenedor del modal no está disponible en el DOM.');
    }
  }, 50);
}
// El formulario del hijo ahora llama a este método
  enviarAlPadre(trackForm: any) {
    if (trackForm.valid) {
      this.msm_error_track = false;
      
      // Enviamos el ID del item y el valor del input al padre
      this.onGuardarTrack.emit({
        id: this.item._id,
        track: this.track
      });
    } else {
      this.msm_error_track = true;
    }
  }

 // Llama a esta función cuando tu formulario termine con éxito
  ocultarModal() {
    if (this.bModal) {
      this.bModal.hide();
    }
  }
}
