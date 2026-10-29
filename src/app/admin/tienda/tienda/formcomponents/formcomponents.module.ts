import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TiendaMapaComponent } from './tienda-mapa/tienda-mapa.component';
import { TiendaRrssComponent } from './tienda-rrss/tienda-rrss.component';
import { TiendamarketingComponent } from './tiendamarketing/tiendamarketing.component';
import { TiendamercadolibreComponent } from './tiendamercadolibre/tiendamercadolibre.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxPaginationModule } from 'ngx-pagination';
import { ComponentsModule } from 'src/app/components/components.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsAtentionModule } from '../../atencion-local/components/components.module';



@NgModule({
  declarations: [
    TiendaMapaComponent,
    TiendaRrssComponent,
    TiendamarketingComponent,
    TiendamercadolibreComponent
  ],
  exports: [
    TiendaMapaComponent,
    TiendaRrssComponent,
    TiendamarketingComponent,
    TiendamercadolibreComponent
  ],
  imports: [
    CommonModule,
    PipesModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    NgxDropzoneModule,
    PdfViewerModule,
    NgxPaginationModule,
    ComponentsAtentionModule,
    SharedModule,
    ComponentsModule,
    PipesModule,
    TranslateModule
  ]
})
export class FormcomponentsModule { }
