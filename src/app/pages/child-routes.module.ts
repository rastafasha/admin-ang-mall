import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { DashboardComponent } from './dashboard/dashboard.component';
import { AccountSettingComponent } from './account-setting/account-setting.component';

import { PerfilComponent } from './perfil/perfil.component';
import { UsuariosComponent } from './mantenimientos/usuarios/usuarios.component';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { AdminGuard } from '../guards/admin.guard';
import { MarcaEditComponent } from '../admin/marca/marca-edit/marca-edit.component';
import { MarcaIndexComponent } from '../admin/marca/marca-index/marca-index.component';
import { CatIndexComponent } from '../admin/categoria/cat-index/cat-index.component';
import { CatEditComponent } from '../admin/categoria/cat-edit/cat-edit.component';
import { ProdIndexComponent } from '../admin/proucto/prod-index/prod-index.component';
import { ProdEditComponent } from '../admin/proucto/prod-edit/prod-edit.component';
import { ConfigSiteComponent } from '../admin/config-site/config-site.component';
import { ColorComponent } from '../admin/proucto/color/color.component';
import { SelectorComponent } from '../admin/proucto/selector/selector.component';
import { CuponComponent } from '../admin/cupon/cupon.component';
import { PromocionComponent } from '../admin/promocion/promocion.component';
import { PostalComponent } from '../admin/postal/postal.component';
import { ContactoComponent } from '../admin/contacto/contacto.component';
import { PapeleraComponent } from '../admin/proucto/papelera/papelera.component';
import { PromoeditComponent } from '../admin/promocion/promoedit/promoedit.component';
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
import { GaleriaProductoComponent } from '../admin/proucto/galeria-producto/galeria-producto.component';
import { CursoIndexComponent } from '../admin/curso/curso-index/curso-index.component';
import { CursoEditComponent } from '../admin/curso/curso-edit/curso-edit.component';
import { SliderComponent } from '../admin/slider/slider.component';
import { SlidereditComponent } from '../admin/slider/slideredit/slideredit.component';
import { PageIndexComponent } from '../admin/page/page-index/page-index.component';
import { PageEditComponent } from '../admin/page/page-edit/page-edit.component';
import { BlogIndexComponent } from '../admin/blog/blog-index/blog-index.component';
import { BlogEditComponent } from '../admin/blog/blog-edit/blog-edit.component';
import { VideoIndexComponent } from '../admin/curso/video-index/video-index.component';
import { VideoEditComponent } from '../admin/curso/video-edit/video-edit.component';
import { UsuarioComponent } from './mantenimientos/usuario/usuario.component';
import { ContactodetailsComponent } from '../admin/contacto/contactodetails/contactodetails.component';
import { TiendaaddComponent } from '../admin/tienda/tienda/tiendaadd/tiendaadd.component';
import { TiendaListComponent } from '../admin/tienda/tienda/tienda-list/tienda-list.component';
import { UsuariosTiendaComponent } from '../admin/tienda/usuarios/usuarios-tienda/usuarios-tienda.component';
import { UsertiendaaddComponent } from '../admin/tienda/usuarios/usertiendaadd/usertiendaadd.component';
import { UserDetailComponent } from '../admin/tienda/usuarios/user-detail/user-detail.component';
import { AtencionLocalComponent } from '../admin/tienda/atencion-local/atencion-local.component';
import { CarritoComponent } from '../admin/tienda/atencion-local/carrito/carrito.component';


const childRoutes: Routes = [
  { path: '', component: DashboardComponent, data:{tituloPage:'Dashboard'} },
            { path: 'account-settings', component: AccountSettingComponent, data:{tituloPage:'Ajustes de Cuenta'} },
            { path: 'buscar/:termino', component: BusquedaComponent, data:{tituloPage:'Busquedas'} },
            { path: 'perfil', component: PerfilComponent, data:{tituloPage:'Perfil'} },
            { path: 'usuario/:id', component: UsuarioComponent, data:{tituloPage:'Perfil Usuario'} },

            //tienda

            { path: 'blog', component: BlogIndexComponent, data:{tituloPage:'Blog '} },
            { path: 'blog/edit/:id', component: BlogEditComponent, data:{tituloPage:'Blog Edit '} },
            { path: 'blog/create', component: BlogEditComponent, data:{tituloPage:'Blog Create '} },

            { path: 'page', component: PageIndexComponent, data:{tituloPage:'Page '} },
            { path: 'page/edit/:id', component: PageEditComponent, data:{tituloPage:'Page Edit '} },
            { path: 'page/create', component: PageEditComponent, data:{tituloPage:'Page Create '} },

            { path: 'slider', component: SliderComponent, data:{tituloPage:'Sliders '} },
            { path: 'slider/edit/:id', component: SlidereditComponent, data:{tituloPage:'Sliders Edit '} },
            { path: 'slider/create', component: SlidereditComponent, data:{tituloPage:'Sliders Create '} },

            { path: 'curso', component: CursoIndexComponent, data:{tituloPage:'Cursos '} },
            { path: 'curso/edit/:id', component: CursoEditComponent, data:{tituloPage:'Cursos Edit '} },
            { path: 'curso/create', component: CursoEditComponent, data:{tituloPage:'Cursos Create '} },

            { path: 'curso/curso-video', component: VideoIndexComponent, data:{tituloPage:'Video '} },
            { path: 'curso/curso-video/create', component: VideoEditComponent, data:{tituloPage:'Videos Create '} },
            { path: 'curso/curso-video/edit/:id', component: VideoEditComponent, data:{tituloPage:'Videos Edit '} },

            { path: 'marca', component: MarcaIndexComponent, data:{tituloPage:'Marcas '} },
            { path: 'marca/edit/:id', component: MarcaEditComponent, data:{tituloPage:'Marca Edit '} },
            { path: 'marca/create', component: MarcaEditComponent, data:{tituloPage:'Marca Create '} },

            { path: 'categoria', component: CatIndexComponent, data:{tituloPage:'Categorias '} },
            { path: 'categoria/edit/:id', component: CatEditComponent, data:{tituloPage:'Categoría Edit '} },
            { path: 'categoria/create', component: CatEditComponent, data:{tituloPage:'Categoría Create '} },

            { path: 'configuracion', component: ConfigSiteComponent, data:{tituloPage:'Configuracion '} },
            { path: 'configuracion/edit/:id', component: ConfigSiteComponent, data:{tituloPage:'Configuracion '} },
            { path: 'configuracion/create', component: ConfigSiteComponent, data:{tituloPage:'Producto'} },

            { path: 'producto', component: ProdIndexComponent, data:{tituloPage:'Producto '} },
            { path: 'producto/edit/:id', component: ProdEditComponent, data:{tituloPage:'Producto'} },
            { path: 'producto/create', component: ProdEditComponent, data:{tituloPage:'Producto Create'} },
            { path: 'producto/color/:id', component: ColorComponent, data:{tituloPage:'Color '} },
            { path: 'producto/selector/:id', component: SelectorComponent, data:{tituloPage:'Selector '} },
            { path: 'producto/papelera/:id', component: PapeleraComponent, data:{tituloPage:'Selector '} },
            { path: 'producto/galeria/:id', component: GaleriaProductoComponent, data:{tituloPage:'Galeria '} },
            { path: 'producto/papelera', component: PapeleraComponent, data:{tituloPage:'Selector '} },

            { path: 'cupon', component: CuponComponent, data:{tituloPage:'Cupon'} },

            { path: 'promocion', component: PromocionComponent, data:{tituloPage:'Promocion '} },
            { path: 'promocion/create', component: PromoeditComponent, data:{tituloPage:'Promocion '} },
            { path: 'promocion/edit/:id', component: PromoeditComponent, data:{tituloPage:'Promocion '} },

            { path: 'postal', component: PostalComponent, data:{tituloPage:'Postal'} },

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
            
            {path: 'tienda', component: TiendaListComponent , data:{tituloPage:'Tienda'}},
            {path: 'tienda/registro', component: TiendaaddComponent , data:{tituloPage:'Tienda'}},
            {path: 'tienda/edit/:id', component: TiendaaddComponent , data:{tituloPage:'Tienda'}},
            {path: 'tienda/detalle/:id', component: DetalleIngresoComponent , data:{tituloPage:'Tienda'}},
            
            {path: 'tienda-user', component: UsuariosTiendaComponent , data:{tituloPage:'Tienda-empleado'}},
            {path: 'tienda-user/registro', component: UsertiendaaddComponent , data:{tituloPage:'Tienda-empleado'}},
            {path: 'tienda-user/edit/:id', component: UsertiendaaddComponent , data:{tituloPage:'Tienda-empleado-edit'}},
            {path: 'tienda-user/detalle/:id', component: UserDetailComponent , data:{tituloPage:'Tienda-empleado-detail'}},
            
            {path: 'atencion-local', component: AtencionLocalComponent , data:{tituloPage:'Atención Local'}},
            {path: 'carrito', component: CarritoComponent , data:{tituloPage:'Tienda Carrito'}},
            {path: 'tienda-user/edit/:id', component: UsertiendaaddComponent , data:{tituloPage:'Tienda-empleado-edit'}},
            {path: 'tienda-user/detalle/:id', component: UserDetailComponent , data:{tituloPage:'Tienda-empleado-detail'}},

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
