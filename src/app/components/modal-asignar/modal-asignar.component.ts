import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Direccion } from 'src/app/models/direccion.model';
import { DireccionService } from 'src/app/services/direccion.service';

declare var bootstrap: any;

@Component({
  selector: 'app-modal-asignar',
  standalone: false,
  templateUrl: './modal-asignar.component.html',
  styleUrl: './modal-asignar.component.css'
})
export class ModalAsignarComponent implements OnChanges, OnInit {

  @Input() drivers: any;
  @Input() ventaSelected: any;
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
  @Output() reloadList: EventEmitter<void> = new EventEmitter<void>();
  @Output() asignar = new EventEmitter<any>();

  direccionSelected!: Direccion

  constructor(
    public direccionService: DireccionService,
    public translate: TranslateService,
  ) { }
  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges): void {

    // console.log('ventaSelected ',this.ventaSelected)
    console.log('drivers ',this.drivers)

    if (
      changes['ventaSelected'] &&
      changes['ventaSelected'].currentValue
    ) {
      this.getDireccion();
    }


  }

  getDireccion() {
    this.direccionService.get_direccion(this.ventaSelected.direccion).subscribe((resp: any) => {
      this.direccionSelected = resp;
    })
  }

  onAsignarDelivery(idDriver: string, objetoVenta: any): void {
    this.asignar.emit({ driver: idDriver, venta: objetoVenta });

    const modalElement = document.getElementById('asignarDelivery');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }

    // 🚀 SOLUCIÓN REPARADORA: Eliminamos manualmente el fondo y los bloqueos de Bootstrap
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.remove();
    }
    // Devolvemos el scroll normal a la pantalla
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';

    // Ahora sí es seguro recargar la lista
    this.reloadList.emit();
  }


  onClose() {
    this.ventaSelected = null;
    this.drivers = null;
    this.reloadList.emit();
    this.closeModal.emit();
  }

}
