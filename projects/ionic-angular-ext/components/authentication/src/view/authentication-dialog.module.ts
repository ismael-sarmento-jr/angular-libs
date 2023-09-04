import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationDialogComponent } from './authentication-dialog.component';



@NgModule({
  declarations: [
    AuthenticationDialogComponent
  ],
  exports: [
    AuthenticationDialogComponent
  ],
  imports: [
    CommonModule
  ]
})
export class AuthenticationDialogModule { }
