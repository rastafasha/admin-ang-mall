import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsignarDeliveryComponent } from './asignar-delivery/asignar-delivery.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { MapaComponent } from './mapa/mapa.component';
import { SharedModule } from "src/app/shared/shared.module";
import { ComponentsModule } from "src/app/components/components.module";



@NgModule({
  declarations: [
    AsignarDeliveryComponent,
    MapaComponent,
  ],
  exports: [
    AsignarDeliveryComponent
  ],
  imports: [
    CommonModule,
    PipesModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    SharedModule,
    ComponentsModule
]
})
export class PostalcompModule { }
