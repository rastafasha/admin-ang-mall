import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-modal-ver-pedido',
  standalone:false,
  templateUrl: './modal-ver-pedido.component.html',
  styleUrl: './modal-ver-pedido.component.css'
})
export class ModalVerPedidoComponent {
  @Input() item:any;


     constructor(
    // Debe ser public para que el HTML pueda leer "translate.currentLang"
    public translate: TranslateService 
  ) {}

}
