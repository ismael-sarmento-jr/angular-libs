import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {StopwatchComponent} from './stopwatch.component';
import {IonicModule} from "@ionic/angular";



@NgModule({
  declarations: [
    StopwatchComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    StopwatchComponent,
  ]
})
export class StopwatchModule { }
