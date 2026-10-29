import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-tiendamarketing',
  standalone:false,
  templateUrl: './tiendamarketing.component.html',
  styleUrl: './tiendamarketing.component.css'
})
export class TiendamarketingComponent {

  // 📥 Recibimos el FormGroup del componente padre
  @Input() formParent!: FormGroup;

}
