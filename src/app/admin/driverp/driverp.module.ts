import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DriverpEditComponent } from './driverp-edit/driverp-edit.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PipesModule } from 'src/app/pipes/pipes.module';



@NgModule({
  declarations: [
    DriverpEditComponent
  ],
  exports: [
    DriverpEditComponent
  ],
  imports: [
    CommonModule,
    PipesModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
  ]
})
export class DriverpModule { }
