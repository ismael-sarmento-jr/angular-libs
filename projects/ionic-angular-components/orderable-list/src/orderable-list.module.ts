import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderableListComponent } from './orderable-list.component';
import {IonicModule} from "@ionic/angular";



@NgModule({
  declarations: [
    OrderableListComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    OrderableListComponent
  ]
})
export class OrderableListModule { }
