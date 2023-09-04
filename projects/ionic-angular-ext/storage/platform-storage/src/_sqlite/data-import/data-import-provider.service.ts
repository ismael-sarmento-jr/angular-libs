import { Injectable } from '@angular/core';
import { StorageService } from '../../storage.service';
import { ImportJob, ImportStep } from './data-import';

@Injectable()
export class DataImportProviderService {

  constructor(
    private _storageService: StorageService
  ) { }

  public async updateJobInfo(job: ImportJob): Promise<ImportJob> {
    await this._storageService.update(job.id, job)
    return this._storageService.get(job.id);
  }

  public async updateJobSharedData(jobId: string, sharedData: any): Promise<ImportJob> {
    const job = await this._storageService.get(jobId);
    job.sharedData = {...job.sharedData, ...sharedData}
    return this.updateJobInfo(job);
  }

  public async getJobInfo(jobId: string): Promise<ImportJob> {
    return this._storageService.get(jobId);
  }

  public async getJobSharedData(jobId: string, key: string): Promise<any> {
    const job = await this._storageService.get(jobId);
    if(job && job.sharedData) {
      return Promise.resolve(job.sharedData[key]);
    }
    return Promise.resolve(null);
  }

  public async updateStepProgress(jobId: string, step: ImportStep): Promise<ImportStep> {
    const stepProgressId = this.getStepId(jobId, step.id);
    await this._storageService.update(stepProgressId, step);
    return this._storageService.get(stepProgressId);
  }
  
  public async getStepProgress(jobId: string, stepKey: string): Promise<ImportStep> {
    return  this._storageService.get(this.getStepId(jobId, stepKey));
  }

  getStepId(jobId: string, stepKey: string): string {
    return `${jobId}-${stepKey}`;
  }
}
