import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { AccountSettingComponent } from './account-setting/account-setting.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PagesComponent } from './pages.component';

import { PerfilComponent } from './perfil/perfil.component';
import { UsuariosComponent } from './mantenimientos/usuarios/usuarios.component';
import { BusquedaComponent } from './busqueda/busqueda.component';


//services
import { IconosService } from '../services/iconos.service';

//modules
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from '../pipes/pipes.module';
import { SharedModule } from '../shared/shared.module';
import { ComponentsModule } from '../components/components.module';

//pluggins
import { NgChartsModule } from 'ng2-charts';
import { NgxPaginationModule } from 'ngx-pagination';
import { UsuarioComponent } from './mantenimientos/usuario/usuario.component';
import { AdminModule } from "../admin/admin.module";
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    DashboardComponent,
    PagesComponent,
    AccountSettingComponent,
    PerfilComponent,
    UsuariosComponent,
    BusquedaComponent,
    UsuarioComponent,
  ],
  exports: [
    DashboardComponent,
    PagesComponent,
    AccountSettingComponent,
    UsuarioComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    SharedModule,
    RouterModule,
    ComponentsModule,
    ReactiveFormsModule,
    PipesModule,
    NgChartsModule,
    NgxPaginationModule,
    AdminModule,
    TranslateModule,
],
  providers:[IconosService]
})
export class PagesModule { }
