import { isDevMode, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Modulos
import { AuthModule } from './auth/auth.module';
import { PagesModule } from './pages/pages.module';
import { NopagefoundComponent } from './nopagefound/nopagefound.component';
import { ComponentsModule } from './components/components.module';
import { PipesModule } from './pipes/pipes.module';
import { AdminModule } from './admin/admin.module';

// Translation
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';

//pwa
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    NopagefoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    PagesModule,
    AuthModule,
    ComponentsModule,
    PipesModule,
    AdminModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      defaultLanguage: 'es',
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => {
          return new TranslateHttpLoader(http);
        },
        deps: [HttpClient]
      }
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Cambiamos a registro inmediato para evitar bloqueos por peticiones en segundo plano
      registrationStrategy: 'registerWhenStable:3000'
    }),
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
  ],
  providers: [
    Document,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
