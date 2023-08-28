import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageComponent } from './page.component';
import { PageMenuComponent } from './page-menu.component';
import {IonicModule} from '@ionic/angular';

@NgModule({
  declarations: [
    PageComponent,
    PageMenuComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    PageComponent,
    PageMenuComponent
  ]
})
export class PageModule { }
