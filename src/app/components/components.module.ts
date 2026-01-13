import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { ModalImagenComponent } from './modal-imagen/modal-imagen.component';
import { BarChartComponent } from './charts/bar-chart/bar-chart.component';
import { LineChartComponent } from './charts/line-chart/line-chart.component';
import { PieChart2Component } from './charts/pie-chart2/pie-chart2.component';
import { LineChart2Component } from './charts/line-chart2/line-chart2.component';
import { ProducListFeaturedComponent } from './produc-list-featured/produc-list-featured.component';
import { PipesModule } from '../pipes/pipes.module';

@NgModule({
  declarations: [
    ModalImagenComponent,
    BarChartComponent,
    LineChartComponent,
    PieChart2Component,
    LineChart2Component,
    ProducListFeaturedComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    NgChartsModule,
    PipesModule
    
  ],
  exports:[
    ModalImagenComponent,
    BarChartComponent,
    LineChartComponent,
    PieChart2Component,
    LineChart2Component,
    ProducListFeaturedComponent,
  ]
})
export class ComponentsModule { }
