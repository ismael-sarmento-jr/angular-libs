import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ColorPickerComponent} from './color-picker.component';
import {IonicModule} from "@ionic/angular";



@NgModule({
  declarations: [
    ColorPickerComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    ColorPickerComponent
  ]
})
export class ColorPickerModule { }
