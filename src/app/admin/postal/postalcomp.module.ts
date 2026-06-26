import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsignarDeliveryComponent } from './asignar-delivery/asignar-delivery.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { MapaComponent } from './mapa/mapa.component';
import { SharedModule } from "src/app/shared/shared.module";
import { ComponentsModule } from "src/app/components/components.module";
import { CrearPostalComponent } from './crear-postal/crear-postal.component';
import { PostalComponent } from './postal.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [
    AsignarDeliveryComponent,
    CrearPostalComponent,
    MapaComponent,
    PostalComponent
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
    ComponentsModule,
    NgxPaginationModule,
    TranslateModule
]
})
export class PostalcompModule { }
