import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-line-chart',
  standalone:false,
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css'],
})
export class LineChartComponent implements OnChanges {
  @Input() ventas: any[] = [];
  public chart: Chart;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['ventas'] && this.ventas && this.ventas.length > 0) {
      this.createChart();
    }
  }

  createChart() {
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

    // Helper function to generate random color
    function getRandomColor() {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }

    // Group ventas by local (tienda)
    const grouped: { [key: string]: number[] } = {};
    if (this.ventas) {
      this.ventas.forEach((venta) => {
        // Use tienda.nombre if available, fallback to venta.local or 'Sin Tienda'
        const tiendaName = (venta.local && venta.local.nombre) || venta.local || 'Sin Tienda';
        if (!grouped[tiendaName]) {
          grouped[tiendaName] = new Array(12).fill(0);
        }
        const dataArray = grouped[tiendaName];
        // Use createdAt date to get month index
        const createdAt = venta.createdAt ? new Date(venta.createdAt) : null;
        const monthIndex = createdAt ? createdAt.getMonth() : 0;
        dataArray[monthIndex] += venta.total_pagado || 0;
      });
    }

    const datasets = Object.keys(grouped).map((tiendaName) => ({
      label: tiendaName,
      data: grouped[tiendaName],
      fill: false,
      borderColor: getRandomColor(),
      tension: 0.1,
    }));

    const data = {
      labels: labels,
      datasets: datasets,
    };

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart('lineChart', {
      type: 'line',
      data: data,
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}
