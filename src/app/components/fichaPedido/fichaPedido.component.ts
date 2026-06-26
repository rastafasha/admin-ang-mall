import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-fichaPedido',
    standalone:false,
    templateUrl: './fichaPedido.component.html',
    styleUrls: ['./fichaPedido.component.css']
})
export class FichaPedidoComponent {
    @Input() item
    // Las funciones ahora se transforman en emisores de eventos
  @Output() activar = new EventEmitter<any>();
  @Output() desactivar = new EventEmitter<any>();
  @Output() finalizar = new EventEmitter<any>();
  @Output() eliminarPedido = new EventEmitter<any>();
    constructor () {}

    // Métodos internos del hijo que se ejecutan al hacer clic en sus botones
   onActivar(id: string): void {
    this.activar.emit(id);
  }
   onDesactivar(id: string): void {
    this.desactivar.emit(id);
  }

  onFinalizar(id: string): void {
    this.finalizar.emit(id);
  }

  onEliminar(item: string): void {
    this.eliminarPedido.emit(item);
  }
}