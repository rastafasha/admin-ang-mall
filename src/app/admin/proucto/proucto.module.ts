import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { ColorComponent } from './color/color.component';
import { ImportarProductosComponent } from './importar-productos/importar-productos.component';
import { PapeleraComponent } from './papelera/papelera.component';
import { ProdEditComponent } from './prod-edit/prod-edit.component';
import { ProdIndexComponent } from './prod-index/prod-index.component';
import { SelectorComponent } from './selector/selector.component';
import { SolicitudesModule } from './solicitudes/solicitudes.module';
import { GaleriaProductoComponent } from './galeria-producto/galeria-producto.component';



@NgModule({
  declarations: [
    ImportarProductosComponent,
    ProdIndexComponent,
    ProdEditComponent,
    ColorComponent,
    SelectorComponent,
    PapeleraComponent,
    GaleriaProductoComponent,
  ],
  exports: [
    ImportarProductosComponent,
    ProdIndexComponent,
    ProdEditComponent,
    ColorComponent,
    SelectorComponent,
    PapeleraComponent,
    GaleriaProductoComponent,
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
    SolicitudesModule
  ]
})
export class ProuctoModule { }
