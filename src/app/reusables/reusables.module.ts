import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from '../components/components.module';



@NgModule({
  declarations: [
    ProgressBarComponent
  ],
  exports: [
    ProgressBarComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ComponentsModule
  ]
})
export class ReusablesModule { }
