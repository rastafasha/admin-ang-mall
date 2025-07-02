import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { ModalImagenComponent } from './modal-imagen/modal-imagen.component';
import { BarChartComponent } from './charts/bar-chart/bar-chart.component';
import { LineChartComponent } from './charts/line-chart/line-chart.component';
import { PieChart2Component } from './charts/pie-chart2/pie-chart2.component';



@NgModule({
  declarations: [
    ModalImagenComponent,
    BarChartComponent,
    LineChartComponent,
    PieChart2Component

  ],
  imports: [
    CommonModule,
    FormsModule,
    NgChartsModule,
    
  ],
  exports:[
    ModalImagenComponent,
    BarChartComponent,
    LineChartComponent,
    PieChart2Component
  ]
})
export class ComponentsModule { }
