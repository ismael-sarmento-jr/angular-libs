import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataImportProviderService } from './data-import/data-import-provider.service';

import { PlatformStorage } from '../platform-storage';
import { StorageService } from '../storage.service';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    {
      provide: DataImportProviderService,
      useFactory: (storage: PlatformStorage) => new DataImportProviderService(new StorageService('_import', storage)),
      deps: [PlatformStorage]
    }
  ]
})
export class SQLiteModule { }
