import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js';
import { environment } from 'src/environments/environment';
import { ReservacionService } from 'src/app/services/reservacion.service';

@Component({
  selector: 'app-reservacion-estadisticas',
  standalone: false,
  templateUrl: './reservacion-estadisticas.component.html',
  styleUrl: './reservacion-estadisticas.component.css'
})
export class ReservacionEstadisticasComponent {

  // Esta es la variable que le pasaremos al @Input() de tu gráfica existente
  public datosAdaptados: any[] = [];
  public tieneDatos = false;
  user: any;
  private reservacionService = inject(ReservacionService);

  ngOnInit(): void {
    let USER = localStorage.getItem("user");
    this.user = JSON.parse(USER ? USER : '');
    this.cargarYAdaptarReservas();
  }


    cargarYAdaptarReservas() {
    this.reservacionService.getReservacionEstadisticasByLocal().subscribe((resp: any) => {
      // 🟢 Forzamos un arreglo totalmente nuevo en memoria para despertar la gráfica
      this.datosAdaptados = [...resp];
      
      this.tieneDatos = this.datosAdaptados.length > 0;
      console.log('Arreglo inmutable listo para el grafico:', this.datosAdaptados);
    });
  }

}
