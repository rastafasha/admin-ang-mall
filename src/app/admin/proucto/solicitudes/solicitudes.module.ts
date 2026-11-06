import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SolicitudDetailComponent } from './solicitud-detail/solicitud-detail.component';
import { SolicitudesListaComponent } from './solicitudes-lista/solicitudes-lista.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxPaginationModule } from 'ngx-pagination';
import { ComponentsModule } from 'src/app/components/components.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { ReusablesModule } from 'src/app/reusables/reusables.module';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    SolicitudDetailComponent,
    SolicitudesListaComponent
  ],
  exports: [
    SolicitudDetailComponent,
    SolicitudesListaComponent
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
    ReusablesModule,
    SharedModule,
    ComponentsModule,
    TranslateModule,
  ]
})
export class SolicitudesModule { }
