import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconosService } from 'src/app/services/iconos.service';


interface RedSocial {
  index?: number;
  name_red: string;
  usuario_red: string;
  icono: string;
}

@Component({
  selector: 'app-tienda-rrss',
   standalone:false,
  templateUrl: './tienda-rrss.component.html',
  styleUrl: './tienda-rrss.component.css'
})
export class TiendaRrssComponent {

  // 📥 Recibe el arreglo actual desde el padre (sirve para creación vacía o edición poblada)
  @Input() redssociales: RedSocial[] = [];
  
  // 📤 Notifica al padre cada vez que el arreglo cambie para que actualice el FormBuilder
  @Output() redssocialesChange = new EventEmitter<RedSocial[]>();

  // Variables locales exclusivas del formulario interno (Two-way binding nativo)
  public name_red: string = '';
  public usuario_red: string = '';
  public icono: string = '';
  public listIcons: any[] = [];

  constructor(private _iconoService: IconosService) {}

  ngOnInit(): void {
    this.cargar_iconos();
  }

  cargar_iconos(): void {
    this._iconoService.getIconsSocial().subscribe((resp: any) => {
      this.listIcons = resp.iconos;
    });
  }

  addRedSocial(): void {
    if (!this.name_red.trim() || !this.usuario_red.trim()) return;

    if (!this.redssociales) {
      this.redssociales = [];
    }

    this.redssociales.push({
      index: this.redssociales.length + 1,
      name_red: this.name_red,
      usuario_red: this.usuario_red,
      icono: this.icono
    });

    // Limpiamos los inputs locales
    this.name_red = '';
    this.usuario_red = '';
    this.icono = '';

    // 🔥 Emitimos el cambio al componente padre
    this.redssocialesChange.emit([...this.redssociales]);
  }

  deleteMedical(i: number): void {
    this.redssociales.splice(i, 1);
    
    // 🔥 Emitimos el cambio al componente padre
    this.redssocialesChange.emit([...this.redssociales]);
  }

}
