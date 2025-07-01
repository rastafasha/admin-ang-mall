import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxPaginationModule } from 'ngx-pagination';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { ListaProductosComponent } from './lista-productos/lista-productos.component';
import { ProductoSelectedComponent } from './productoSelected/productoSelected.component';
// Import CKEditorModule from 'ckeditor4-angular'
import { CKEditorModule } from 'ckeditor4-angular';



@NgModule({
  declarations: [
    ListaProductosComponent,
    ProductoSelectedComponent
  ],
  exports: [
    ListaProductosComponent,
    ProductoSelectedComponent
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
        CKEditorModule,
  ]
})
export class ComponentsAtentionModule { }
