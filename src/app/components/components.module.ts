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
import { ModalInicialComponent } from './modal-inicial/modal-inicial.component';



import { ModalVerPedidoComponent } from './modal-ver-pedido/modal-ver-pedido.component';
import { ModalTrackingComponent } from './modal-tracking/modal-tracking.component';
import { TranslateModule } from '@ngx-translate/core';
import { FichaPedidoComponent } from './fichaPedido/fichaPedido.component';
import { ModalInstruccionesComponent } from './modal-instrucciones/modal-instrucciones.component';
import { ModalAsignarComponent } from './modal-asignar/modal-asignar.component';

@NgModule({
  declarations: [
    ModalImagenComponent,
    BarChartComponent,
    LineChartComponent,
    PieChart2Component,
    LineChart2Component,
    ProducListFeaturedComponent,
    ModalInicialComponent,
    ModalVerPedidoComponent,
    ModalTrackingComponent,
    FichaPedidoComponent,
    ModalInstruccionesComponent,
    ModalAsignarComponent

  ],
  
  exports:[
    ModalImagenComponent,
    BarChartComponent,
    LineChartComponent,
    PieChart2Component,
    LineChart2Component,
    ProducListFeaturedComponent,
    ModalInicialComponent,
    ModalVerPedidoComponent,
    ModalTrackingComponent,
    FichaPedidoComponent,
    ModalInstruccionesComponent,
    ModalAsignarComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgChartsModule,
    PipesModule,
    TranslateModule
    
  ],
})
export class ComponentsModule { }
