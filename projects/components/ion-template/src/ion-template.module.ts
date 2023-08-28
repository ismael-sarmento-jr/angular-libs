import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {IonTemplateComponent} from './ion-template.component';



@NgModule({
  declarations: [
    IonTemplateComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    IonTemplateComponent
  ]
})
export class IonTemplateModule { }
