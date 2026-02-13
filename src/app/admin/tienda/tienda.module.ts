import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsertiendaaddComponent } from './usuarios/usertiendaadd/usertiendaadd.component';
import { TiendaaddComponent } from './tienda/tiendaadd/tiendaadd.component';
import { UsuariosTiendaComponent } from './usuarios/usuarios-tienda/usuarios-tienda.component';
import { TiendaListComponent } from './tienda/tienda-list/tienda-list.component';
import { TiendaDetailComponent } from './tienda/tienda-detail/tienda-detail.component';
import { UserDetailComponent } from './usuarios/user-detail/user-detail.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxPaginationModule } from 'ngx-pagination';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { AtencionLocalComponent } from './atencion-local/atencion-local.component';
import { CarritoComponent } from './atencion-local/carrito/carrito.component';
import { ProductoComponent } from './atencion-local/producto/producto.component';
import { ComponentsAtentionModule } from './atencion-local/components/components.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { DriverpModule } from "src/app/admin/driverp/driverp.module";
import { PedidosMenuComponent } from './pedidos-menu/pedidos-menu.component';


@NgModule({
  declarations: [
    UsertiendaaddComponent,
    TiendaaddComponent,
    UsuariosTiendaComponent,
    TiendaListComponent,
    TiendaDetailComponent,
    UserDetailComponent,
    AtencionLocalComponent,
    CarritoComponent,
    ProductoComponent,
    PedidosMenuComponent,

  ],
  exports: [
    UsertiendaaddComponent,
    TiendaaddComponent,
    UsuariosTiendaComponent,
    TiendaListComponent,
    TiendaDetailComponent,
    UserDetailComponent,
     PedidosMenuComponent,

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
    ComponentsAtentionModule,
    SharedModule,
    DriverpModule
]
})
export class TiendaModule { }
