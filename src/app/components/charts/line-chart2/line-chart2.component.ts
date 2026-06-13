import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-line-chart2',
  standalone: false,
  templateUrl: './line-chart2.component.html',
  styleUrls: ['./line-chart2.component.css']
})
export class LineChart2Component implements OnChanges {

  @Input() ventas: any[] = [];
  public chart: Chart;

  constructor(
    // Debe ser public para que el HTML pueda leer "translate.currentLang"
    public translate: TranslateService
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['ventas'] && this.ventas && this.ventas.length > 0) {
      this.createChart();
    }
  }

  createChart() {
    const labelsOriginales = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    // Si usas ngx-translate, puedes resolverlo de forma limpia en tu configuración del gráfico:
    const labels = labelsOriginales.map(mes => {
      return this.translate.currentLang === 'en'
        ? { 'Enero': 'January', 'Febrero': 'February', 'Marzo': 'March', 'Abril': 'April', 'Mayo': 'May', 'Junio': 'June', 'Julio': 'July', 'Agosto': 'August', 'Septiembre': 'September', 'Octubre': 'October', 'Noviembre': 'November', 'Diciembre': 'December' }[mes]
        : mes;
    });

    // Helper function to generate random color
    function getRandomColor() {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }

    // Aggregate sales by month
    const salesByMonth: number[] = new Array(12).fill(0);
    if (this.ventas) {
      this.ventas.forEach((venta) => {
        // Use month field if available, else use createdAt
        let monthIndex = 0;
        if (venta.month !== undefined) {
          monthIndex = venta.month - 1; // month is 1-12, index 0-11
        } else if (venta.createdAt) {
          const createdAt = new Date(venta.createdAt);
          monthIndex = createdAt.getMonth();
        }
        if (monthIndex >= 0 && monthIndex < 12) {
          salesByMonth[monthIndex] += 1; // Count the number of sales
        }
      });
    }

    const datasets = [{
      label: this.translate.currentLang === 'en' ? 'Monthly Sales' : 'Ventas Mensuales',
      data: salesByMonth,
      fill: false,
      borderColor: getRandomColor(),
      tension: 0.1,
    }];

    const data = {
      labels: labels,
      datasets: datasets,
    };

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart('lineChart2', {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

}
