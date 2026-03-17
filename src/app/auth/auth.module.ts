import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { TranslateModule } from '@ngx-translate/core';
import { NewpasswordComponent } from './newpassword/newpassword.component';
import { PasswordresetComponent } from './passwordreset/passwordreset.component';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    NewpasswordComponent,
    PasswordresetComponent
  ],
  exports: [
    LoginComponent,
    RegisterComponent,
    NewpasswordComponent,
    PasswordresetComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule
  ]
})
export class AuthModule { }
