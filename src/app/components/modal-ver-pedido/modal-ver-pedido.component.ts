import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-modal-ver-pedido',
  standalone:false,
  templateUrl: './modal-ver-pedido.component.html',
  styleUrl: './modal-ver-pedido.component.css'
})
export class ModalVerPedidoComponent {
  @Input() item:any;

}
