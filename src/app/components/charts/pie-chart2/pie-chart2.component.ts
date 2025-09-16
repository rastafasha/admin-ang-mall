import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-pie-chart2',
  templateUrl: './pie-chart2.component.html',
  styleUrls: ['./pie-chart2.component.css']
})
export class PieChart2Component implements OnChanges {
  public chart: Chart<'doughnut', number[], string>;
  @Input() ventas: any[];
  @Input() total_ganado: any[];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['ventas'] && this.ventas) {
      this.updateChart();
    }
    if (changes['total_ganado'] && this.total_ganado) {
      this.updateChart();
    }
  }

  updateChart() {
    // Count ventas by estado
    const estadoCounts = {
      'Venta en proceso': 0,
      'Enviado': 0,
      'Reembolsado': 0,
      'Finalizado': 0,
      'Cancelado': 0
    };

    this.ventas.forEach(p => {
      if (estadoCounts.hasOwnProperty(p.estado)) {
        estadoCounts[p.estado]++;
      }
    });

    const data = {
      labels: ['Venta en proceso', 'Enviado', 'Reembolsado', 'Finalizado', 'Cancelado' ],
      datasets: [
        {
          label: 'Estados de Ventas',
          data: [
            estadoCounts['Venta en proceso'],
            estadoCounts['Enviado'],
            estadoCounts['Reembolsado'],
            estadoCounts['Finalizado'],
            estadoCounts['Cancelado']
          ],
          backgroundColor: [
            'rgba(54, 162, 235, 0.6)', // blue for en proceso
            'rgba(75, 192, 192, 0.6)', // green for enviado
            'rgba(255, 99, 132, 0.6)', // red for reembolsado
            'rgba(75, 192, 192, 0.6)', // green for finalizado
            'rgba(255, 99, 132, 0.6)'  // red for cancelado
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(255, 99, 132, 1)',
          ],
          borderWidth: 1
        }
      ]
    };

    if (this.chart) {
      this.chart.data = data;
      this.chart.update();
    } else {
      this.chart = new Chart('pieChart', {
        type: 'doughnut',
        data: data,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Estados de Ventas Mensuales'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  }
}
