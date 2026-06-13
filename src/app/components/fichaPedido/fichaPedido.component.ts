import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-fichaPedido',
    standalone:false,
    templateUrl: './fichaPedido.component.html',
    styleUrls: ['./fichaPedido.component.css']
})
export class FichaPedidoComponent {
    @Input() item
    @Input() activar
    @Input() finalizar
    @Input() eliminarPedido
    constructor () {}
}