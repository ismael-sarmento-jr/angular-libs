import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlphanumericDirective } from './alphanumeric.directive';



@NgModule({
  declarations: [
    AlphanumericDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AlphanumericDirective
  ]
})
export class InputAlphanumericModule { }
