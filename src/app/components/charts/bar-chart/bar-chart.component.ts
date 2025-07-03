import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnChanges {
  public chart: Chart;
  @Input() ventas: any;
  @Input() total_ganado: any;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['ventas'] && this.ventas) {
      this.createChart();
    }
    if (changes['total_ganado'] && this.total_ganado) {
      this.createChart();
    }
  }

  private createChart() {
    const labels = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];

    // Initialize arrays for monto and monto_pendiente per month
    const montoData = new Array(12).fill(0);
    const montoPendienteData = new Array(12).fill(0);

    // Aggregate monto and monto_pendiente by month
    this.ventas.forEach(payment => {
      if (payment.created_at) {
        const date = new Date(payment.created_at);
        const month = date.getMonth(); // 0-based month index
        montoData[month] += Number(payment.monto) || 0;
        montoPendienteData[month] += Number(payment.monto_pendiente) || 0;
      }
    });

    const data = {
      labels: labels,
      datasets: [
        {
          label: 'Pagados',
          data: montoData,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        },
        {
          label: 'Pendientes',
          data: montoPendienteData,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
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
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Comportamiento del Año'
          }
        },
      },
    });
  }
}
