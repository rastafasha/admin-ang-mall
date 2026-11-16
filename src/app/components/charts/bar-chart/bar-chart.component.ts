import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-bar-chart',
  standalone: false,
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnChanges {
 @ViewChild('barCanvas') barCanvas!: ElementRef<HTMLCanvasElement>;
  public chart: Chart;
  isLoading=false;

  @Input() estadisticas: any[] = [];

  constructor(
    public translate: TranslateService 
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['estadisticas'] && this.estadisticas) {
      
      this.createChart();
    }
  }

  private createChart() {
    this.isLoading=true;

    setTimeout(() => {
      if (!this.estadisticas || this.estadisticas.length === 0) return;

      // Verificamos que el canvas ya exista en la vista antes de dibujar
      if (!this.barCanvas || !this.barCanvas.nativeElement) {
        return;
      }

      this.isLoading=false;

      const labels = this.estadisticas.map(item => item._id);
      const totalFacturado = this.estadisticas.map(item => item.totalVendido); 
      const cantidadOrdenes = this.estadisticas.map(item => item.cantidadOrdenes);

      const data = {
        labels: labels,
        datasets: [
          {
            label: this.translate.currentLang === 'en' ? 'Total Sales ($)' : 'Total Vendido ($)',
            data: totalFacturado,
            backgroundColor: 'rgba(255, 230, 0, 0.75)',
            borderColor: 'rgba(230, 200, 0, 1)',
            borderWidth: 1,
            borderRadius: 4,
            yAxisID: 'y'
          },
          {
            label: this.translate.currentLang === 'en' ? 'Orders Count' : 'Órdenes Completadas',
            data: cantidadOrdenes,
            backgroundColor: 'rgba(45, 50, 119, 0.75)',
            borderColor: 'rgba(45, 50, 119, 1)',
            borderWidth: 1,
            borderRadius: 4,
            yAxisID: 'y1'
          }
        ]
      };

      if (this.chart) {
        this.chart.destroy();
      }

      this.chart = new Chart(this.barCanvas.nativeElement, {
        type: 'bar',
        data: data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'index',
            intersect: false,
          },
          scales: {
            x: { 
              grid: { display: false } 
            },
            y: {
              type: 'linear',
              display: true,
              position: 'left',
              beginAtZero: true,
              title: {
                display: true,
                text: this.translate.currentLang === 'en' ? 'Amount ($)' : 'Monto ($)'
              }
            },
            y1: {
              type: 'linear',
              display: true,
              position: 'right',
              beginAtZero: true,
              grid: {
                drawOnChartArea: false
              },
              ticks: { 
                stepSize: 1 
              },
              title: {
                display: true,
                text: this.translate.currentLang === 'en' ? 'Orders' : 'Órdenes'
              }
            }
          },
          plugins: {
            legend: { position: 'top' },
            title: {
              display: true,
              text: this.translate.currentLang === 'en' 
                ? 'Mercado Libre Sales Summary (Last 30 Days)' 
                : 'Resumen de Ventas Mercado Libre (Últimos 30 Días)',
            }
          },
        },
      });
    }, 60);
  }



}
