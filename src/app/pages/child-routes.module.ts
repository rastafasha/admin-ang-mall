import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminGuard } from '../guards/admin.guard';

import { DashboardComponent } from './dashboard/dashboard.component';
import { AccountSettingComponent } from './account-setting/account-setting.component';

import { PerfilComponent } from './perfil/perfil.component';
import { UsuariosComponent } from './mantenimientos/usuarios/usuarios.component';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { MarcaIndexComponent } from '../admin/marca/marca-index/marca-index.component';
import { CatIndexComponent } from '../admin/categoria/cat-index/cat-index.component';
import { ProdIndexComponent } from '../admin/proucto/prod-index/prod-index.component';
import { ConfigSiteComponent } from '../admin/config-site/config-site.component';
import { CuponComponent } from '../admin/cupon/cupon.component';
import { PromocionComponent } from '../admin/promocion/promocion.component';
import { PostalComponent } from '../admin/postal/postal.component';
import { ContactoComponent } from '../admin/contacto/contacto.component';
import { AdminVentasComponent } from '../admin/ventas/admin-ventas/admin-ventas.component';
import { DetalleCancelacionComponent } from '../admin/cancelacion/detalle-cancelacion/detalle-cancelacion.component';
import { IndexCancelacionComponent } from '../admin/cancelacion/index-cancelacion/index-cancelacion.component';
import { AdminChatComponent } from '../admin/ticket/admin-chat/admin-chat.component';
import { AdminTicketComponent } from '../admin/ticket/admin-ticket/admin-ticket.component';
import { AdminDetalleventasComponent } from '../admin/ventas/admin-detalleventas/admin-detalleventas.component';
import { InvoiceComponent } from '../admin/ventas/invoice/invoice.component';
import { CreateIngresoComponent } from '../admin/ingreso/create-ingreso/create-ingreso.component';
import { DetalleIngresoComponent } from '../admin/ingreso/detalle-ingreso/detalle-ingreso.component';
import { IndexIngresoComponent } from '../admin/ingreso/index-ingreso/index-ingreso.component';
import { CursoIndexComponent } from '../admin/curso/curso-index/curso-index.component';
import { CursoEditComponent } from '../admin/curso/curso-edit/curso-edit.component';
import { SliderComponent } from '../admin/slider/slider.component';
import { PageIndexComponent } from '../admin/page/page-index/page-index.component';
import { BlogIndexComponent } from '../admin/blog/blog-index/blog-index.component';
import { VideoIndexComponent } from '../admin/curso/video-index/video-index.component';
import { VideoEditComponent } from '../admin/curso/video-edit/video-edit.component';
import { UsuarioComponent } from './mantenimientos/usuario/usuario.component';
import { ContactodetailsComponent } from '../admin/contacto/contactodetails/contactodetails.component';
import { TiendaListComponent } from '../admin/tienda/tienda/tienda-list/tienda-list.component';
import { UsuariosTiendaComponent } from '../admin/tienda/usuarios/usuarios-tienda/usuarios-tienda.component';
import { UsertiendaaddComponent } from '../admin/tienda/usuarios/usertiendaadd/usertiendaadd.component';
import { UserDetailComponent } from '../admin/tienda/usuarios/user-detail/user-detail.component';
import { AtencionLocalComponent } from '../admin/tienda/atencion-local/atencion-local.component';
import { CarritoComponent } from '../admin/tienda/atencion-local/carrito/carrito.component';
import { ListaTrasnferenciasComponent } from '../admin/transferencias/lista-trasnferencias/lista-trasnferencias.component';
import { TiposdepagoComponent } from '../admin/tiposdepago/tiposdepago.component';
import { PagosEfectivoComponent } from '../admin/pagos-efectivo/pagos-efectivo.component';
import { PagosChequeComponent } from '../admin/pagos-cheque/pagos-cheque.component';
import { PedidosMenuComponent } from '../admin/tienda/pedidos-menu/pedidos-menu.component';
import { AsignarDeliveryComponent } from '../admin/postal/postalcomp/asignar-delivery/asignar-delivery.component';
import { MapaComponent } from '../admin/postal/postalcomp/mapa/mapa.component';
import { ComentariosappComponent } from '../admin/tienda/comentariosapp/comentariosapp.component';
import { TasabcvComponent } from '../admin/tasas/tasabcv/tasabcv.component';
import { TasaeurobcvComponent } from '../admin/tasas/tasaeurobcv/tasaeurobcv.component';
import { ReservacionListComponent } from '../admin/tienda/reservacion/reservacion-list/reservacion-list.component';
import { NotificacionesComponent } from '../admin/tienda/notificaciones/notificaciones.component';
import { ConectarWhatsappComponent } from '../admin/tienda/conectar-whatsapp/conectar-whatsapp.component';


const childRoutes: Routes = [
  { path: '', component: DashboardComponent, data:{tituloPage:'Dashboard'} },
            { path: 'account-settings', component: AccountSettingComponent, data:{tituloPage:'Ajustes de Cuenta'} },
            { path: 'buscar/:termino', component: BusquedaComponent, data:{tituloPage:'Busquedas'} },
            { path: 'perfil', component: PerfilComponent, data:{tituloPage:'Perfil'} },
            { path: 'usuario/:id', component: UsuarioComponent, data:{tituloPage:'Perfil Usuario'} },

            //tienda

            { path: 'blog', component: BlogIndexComponent, data:{tituloPage:'Blog '} },

            { path: 'page', component: PageIndexComponent, data:{tituloPage:'Page '} },
            

            { path: 'slider', component: SliderComponent, data:{tituloPage:'Sliders '} },

            { path: 'curso', component: CursoIndexComponent, data:{tituloPage:'Cursos '} },
            { path: 'curso/edit/:id', component: CursoEditComponent, data:{tituloPage:'Cursos Edit '} },
            { path: 'curso/create', component: CursoEditComponent, data:{tituloPage:'Cursos Create '} },

            { path: 'curso/curso-video', component: VideoIndexComponent, data:{tituloPage:'Video '} },
            { path: 'curso/curso-video/create', component: VideoEditComponent, data:{tituloPage:'Videos Create '} },
            { path: 'curso/curso-video/edit/:id', component: VideoEditComponent, data:{tituloPage:'Videos Edit '} },

            { path: 'marca', component: MarcaIndexComponent, data:{tituloPage:'Marcas '} },

            { path: 'categoria', component: CatIndexComponent, data:{tituloPage:'Categorias '} },

            { path: 'configuracion', component: ConfigSiteComponent, data:{tituloPage:'Configuracion '} },
            { path: 'configuracion/edit/:id', component: ConfigSiteComponent, data:{tituloPage:'Configuracion '} },
            { path: 'configuracion/create', component: ConfigSiteComponent, data:{tituloPage:'Producto'} },

            { path: 'producto', component: ProdIndexComponent, data:{tituloPage:'Producto '} },

            { path: 'cupon', component: CuponComponent, data:{tituloPage:'Cupon'} },

            { path: 'promocion', component: PromocionComponent, data:{tituloPage:'Promocion '} },

            { path: 'postal', component: PostalComponent, data:{tituloPage:'Configurar Delivery'} },
            { path: 'postal/asignaciones', component: AsignarDeliveryComponent, data:{tituloPage:'Asignar Delivery'} },
            { path: 'postal/mapa', component: MapaComponent, data:{tituloPage:'Mapa Delivery'} },

            { path: 'contacto', component: ContactoComponent, data:{tituloPage:'Contacto'} },
            { path: 'contacto/:id', component: ContactodetailsComponent, data:{tituloPage:'Contacto'} },

            {path: 'tikets/modulo', component: AdminTicketComponent, data:{tituloPage:'Ticket'}},
            {path: 'tikets/modulo/chat/:id', component: AdminChatComponent, data:{tituloPage:'Ticket'}},

            {path: 'cancelacion/modulo', component: IndexCancelacionComponent , data:{tituloPage:'Cancelación'}},
            {path: 'cancelacion/modulo/detalle/:id', component: DetalleCancelacionComponent , data:{tituloPage:'Cancelación'}},

            {path: 'ventas/modulo', component: AdminVentasComponent , data:{tituloPage:'Ventas'}},
            {path: 'ventas/modulo/invoice/:id', component: InvoiceComponent , data:{tituloPage:'Ventas'}},
            {path: 'ventas/modulo/detalle/:id', component: AdminDetalleventasComponent , data:{tituloPage:'Ventas'}},

            {path: 'ingresos', component: IndexIngresoComponent , data:{tituloPage:'Ingresos'}},
            {path: 'ingresos/registro', component: CreateIngresoComponent , data:{tituloPage:'Ingresos'}},
            {path: 'ingresos/detalle/:id', component: DetalleIngresoComponent , data:{tituloPage:'Ingresos'}},
            //tienda
            {path: 'tienda', component: TiendaListComponent , data:{tituloPage:'Tienda'}},
            {path: 'tienda/comentariosapp', component: ComentariosappComponent , data:{tituloPage:'Comentarios App'}},
            {path: 'tienda/pedidos', component: PedidosMenuComponent , data:{tituloPage:'Pedidos'}},
            {path: 'atencion-local', component: AtencionLocalComponent , data:{tituloPage:'Atención Local'}},
            {path: 'tienda-user', component: UsuariosTiendaComponent , data:{tituloPage:'Tienda empleado'}},
            {path: 'tienda-user/registro', component: UsertiendaaddComponent , data:{tituloPage:'Tienda empleado'}},
            {path: 'tienda-user/edit/:id', component: UsertiendaaddComponent , data:{tituloPage:'Tienda empleado editar'}},
            {path: 'tienda-user/detalle/:id', component: UserDetailComponent , data:{tituloPage:'Tienda empleado detalle'}},
            {path: 'tienda-user/edit/:id', component: UsertiendaaddComponent , data:{tituloPage:'Tienda empleado editar'}},
            {path: 'tienda-user/detalle/:id', component: UserDetailComponent , data:{tituloPage:'Tienda empleado detalle'}},
            {path: 'reservaciones', component: ReservacionListComponent , data:{tituloPage:'Reservaciones'}},
            {path: 'carrito', component: CarritoComponent , data:{tituloPage:'Tienda Carrito'}},
            {path: 'notificaciones', component: NotificacionesComponent , data:{tituloPage:'Notificaciones'}},
            {path: 'conectarawhatsapp', component: ConectarWhatsappComponent , data:{tituloPage:'Conectar a Whatsapp'}},
            //pagos
            {path: 'tipos-de-pago', component: TiposdepagoComponent , data:{tituloPage:'Tipos de Pago'}},
            {path: 'transferencias', component: ListaTrasnferenciasComponent , data:{tituloPage:'Transferencias'}},
            {path: 'pagoscheque', component: PagosChequeComponent, data:{tituloPage:'Pagos en cheque'}},
            {path: 'pagosefectivo', component: PagosEfectivoComponent, data:{tituloPage:'Pagos en Efectivo'}},
        
            
            //tasas
            {path: 'tasadollarbcv', component: TasabcvComponent , data:{tituloPage:'Tasa Dollar Bcv'}},
            {path: 'tasaeurobcv', component: TasaeurobcvComponent , data:{tituloPage:'Tasa Euro Bcv'}},
            
            //mantenimientos


            //rutas de admin
            // canActivate: [ AdminGuard ],
            { path: 'usuarios',  component: UsuariosComponent, data:{tituloPage:'Mantenimiento de Usuarios '} },
]

@NgModule({
  imports: [ RouterModule.forChild(childRoutes) ],
    exports: [ RouterModule ]
})
export class ChildRoutesModule { }
