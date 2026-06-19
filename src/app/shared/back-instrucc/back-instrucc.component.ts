import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-back-instrucc',
  standalone:false,
  templateUrl: './back-instrucc.component.html',
  styleUrl: './back-instrucc.component.css'
})
export class BackInstruccComponent {

  @Output() onOpenHelp = new EventEmitter<void>();
  @Input()instruccionesModal;

  abrirAyuda() {
    this.onOpenHelp.emit();
  }
}
