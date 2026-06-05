import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-bar-chart',
  standalone:false,
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnChanges {
  public chart: Chart;
  
  // Recibe la data limpia procesada desde tu backend (.aggregate)
  @Input() estadisticas: any[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['estadisticas'] && this.estadisticas) {
      this.createChart();
    }
  }

private createChart() {
  setTimeout(() => {
    
    if (!this.estadisticas || this.estadisticas.length === 0) return;

    // 🟢 CORRECCIÓN DEFINITIVA: Mapeamos los campos reales de las reservas sin inventar montos
    const labels = this.estadisticas.map(item => item._id); // Las fechas ('2024-11-20', '2024-11-23')
    const totalReservas = this.estadisticas.map(item => item.totalReservas); // Cantidad de mesas (2 y 1)
    const totalPersonas = this.estadisticas.map(item => item.totalPersonas); // Total de personas (6 y 3)

    const data = {
      labels: labels,
      datasets: [
        {
          label: 'Reservas Creadas',
          data: totalReservas,
          backgroundColor: 'rgba(54, 162, 235, 0.6)', // Barra Azul
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          borderRadius: 4
        },
        {
          label: 'Total Comensales',
          data: totalPersonas,
          backgroundColor: 'rgba(75, 192, 192, 0.6)', // Barra Verde
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          borderRadius: 4
        }
      ]
    };

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart('barChart', {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { grid: { display: false } },
          y: { 
            beginAtZero: true,
            ticks: { stepSize: 1 } 
          },
        },
        plugins: {
          legend: { position: 'top' },
          title: {
            display: true,
            text: 'Flujo de Reservaciones (Últimos Días)'
          }
        },
      },
    });

  }, 60);
}



}
