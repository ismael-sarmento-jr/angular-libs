import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { FilteredListComponent } from './filtered-list.component';
import { SlicePipe } from './slice.pipe';


@NgModule({
  declarations: [
    FilteredListComponent,
    SlicePipe
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule
  ],
  exports: [
    FilteredListComponent
  ]
})
export class FilteredListModule { }
