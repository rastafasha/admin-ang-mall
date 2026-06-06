import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsertiendaaddComponent } from './usuarios/usertiendaadd/usertiendaadd.component';
import { TiendaaddComponent } from './tienda/tiendaadd/tiendaadd.component';
import { UsuariosTiendaComponent } from './usuarios/usuarios-tienda/usuarios-tienda.component';
import { TiendaListComponent } from './tienda/tienda-list/tienda-list.component';
import { UserDetailComponent } from './usuarios/user-detail/user-detail.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
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
import { ComponentsModule } from 'src/app/components/components.module';
import { ComentariosappComponent } from './comentariosapp/comentariosapp.component';
import { ReservacionListComponent } from './reservacion/reservacion-list/reservacion-list.component';
import { ReservacionViewComponent } from './reservacion/reservacion-view/reservacion-view.component';
import { NotificacionesComponent } from './notificaciones/notificaciones.component';
import { ReservacionEstadisticasComponent } from './reservacion/reservacion-estadisticas/reservacion-estadisticas.component';
import { ConectarWhatsappComponent } from './conectar-whatsapp/conectar-whatsapp.component';


@NgModule({
  declarations: [
    UsertiendaaddComponent,
    TiendaaddComponent,
    UsuariosTiendaComponent,
    TiendaListComponent,
    UserDetailComponent,
    AtencionLocalComponent,
    CarritoComponent,
    ProductoComponent,
    PedidosMenuComponent,
    ComentariosappComponent,
    ReservacionListComponent,
    ReservacionViewComponent,
    NotificacionesComponent,
    ReservacionEstadisticasComponent,
    ConectarWhatsappComponent

  ],
  exports: [
    UsertiendaaddComponent,
    TiendaaddComponent,
    UsuariosTiendaComponent,
    TiendaListComponent,
    UserDetailComponent,
    PedidosMenuComponent,
    ComentariosappComponent,
    ReservacionListComponent,
    ReservacionViewComponent,
    NotificacionesComponent,
    ReservacionEstadisticasComponent,
    ConectarWhatsappComponent

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
    // CKEditorModule,
    ComponentsAtentionModule,
    SharedModule,
    DriverpModule,
    ComponentsModule,
    PipesModule
  ]
})
export class TiendaModule { }
