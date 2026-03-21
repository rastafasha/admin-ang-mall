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
import { ModalinfoTiendasComponent } from './modalinfo-tiendas/modalinfo-tiendas.component';
import { ModalinfoPedidosListComponent } from './modalinfo-pedidos-list/modalinfo-pedidos-list.component';
import { ModalinfoAtencioLocalComponent } from './modalinfo-atencio-local/modalinfo-atencio-local.component';
import { ModalinfoUsuariosTiendaComponent } from './modalinfo-usuarios-tienda/modalinfo-usuarios-tienda.component';
import { ModalinfoProductosComponent } from './modalinfo-productos/modalinfo-productos.component';
import { ModalinfoCategoriasComponent } from './modalinfo-categorias/modalinfo-categorias.component';
import { ModalinfoVentasComponent } from './modalinfo-ventas/modalinfo-ventas.component';
import { ModalinfoTiposPagoComponent } from './modalinfo-tipos-pago/modalinfo-tipos-pago.component';
import { ModalinfoTransferenciasComponent } from './modalinfo-transferencias/modalinfo-transferencias.component';
import { ModalinfoPagoEfectivoComponent } from './modalinfo-pago-efectivo/modalinfo-pago-efectivo.component';
import { ModalinfoDeliveryComponent } from './modalinfo-delivery/modalinfo-delivery.component';

@NgModule({
  declarations: [
    ModalImagenComponent,
    BarChartComponent,
    LineChartComponent,
    PieChart2Component,
    LineChart2Component,
    ProducListFeaturedComponent,
    ModalInicialComponent,
    ModalinfoTiendasComponent,
    ModalinfoPedidosListComponent,
    ModalinfoAtencioLocalComponent,
    ModalinfoUsuariosTiendaComponent,
    ModalinfoProductosComponent,
    ModalinfoCategoriasComponent,
    ModalinfoVentasComponent,
    ModalinfoTiposPagoComponent,
    ModalinfoTransferenciasComponent,
    ModalinfoPagoEfectivoComponent,
    ModalinfoDeliveryComponent

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
    ModalInicialComponent,
    ModalinfoTiendasComponent,
    ModalinfoPedidosListComponent,
    ModalinfoAtencioLocalComponent,
    ModalinfoUsuariosTiendaComponent,
     ModalinfoProductosComponent,
    ModalinfoCategoriasComponent,
    ModalinfoVentasComponent,
    ModalinfoTiposPagoComponent,
    ModalinfoTransferenciasComponent,
    ModalinfoPagoEfectivoComponent,
    ModalinfoDeliveryComponent
  ]
})
export class ComponentsModule { }
