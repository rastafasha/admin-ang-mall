import { NgModule } from '@angular/core';
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

import {HttpClientModule, HttpClient, HTTP_INTERCEPTORS} from '@angular/common/http';

import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

//pwa
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ProgressBarComponent } from './reusables/progress-bar/progress-bar.component';

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
    CKEditorModule,
    TranslateModule.forRoot({
      defaultLanguage: 'es',
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => {
          return new TranslateHttpLoader(http);
        },
        deps: [ HttpClient ]
      }
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
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
