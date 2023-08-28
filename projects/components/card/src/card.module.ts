import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CardComponent } from './card.component';
import {IonicModule} from '@ionic/angular';

@NgModule({
  declarations: [
      CardComponent
  ],
  exports: [
      CardComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class CardModule { }
