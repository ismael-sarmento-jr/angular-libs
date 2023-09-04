import { Observable, ReplaySubject, of } from 'rxjs';
import { DataImportConfig as DataImportConfig, JobInteractionInfo, ImportStep, JobProgress } from './data-import';
import { DataImportStepExecutor } from './data-import-step.executor';
import { SQLiteService } from '../sqlite.service';
import { DataImportProviderService } from './data-import-provider.service';
import { QueueService} from 'angular-core/queue';

export interface DataImportEngine {
    /**
     * @return observable with information on import job completion
     */
    importData(): Observable<JobProgress>;
    stepsExecutors(): DataImportStepExecutor[];
    configEngineAndSteps(config: DataImportConfig): void;
    updateJobState(jobId: string, stepKey: string, message: string, offset: number, percentage: number, sharedData: any): any;
}
export default abstract class BaseDataImportEngine implements DataImportEngine {

    databaseService: SQLiteService;
    private _currentStep: ImportStep;
    jobCompletionSubject = new ReplaySubject<JobProgress>(1);
    jobInteractionSubject = new ReplaySubject<JobInteractionInfo>(1);
    config: DataImportConfig;
    jobId: string;

    constructor(
        protected source: string,
        private _dataImportProvider: DataImportProviderService,
        _queueService: QueueService
    ) {}
    
    importData(): Observable<JobProgress> {
        if(!this.config.databaseName) {
            return of();
        }
        try {
            this.generateUniqueJobId().then(async jobId => {
                this.jobId = jobId;
                await this._dataImportProvider.updateJobInfo({id: jobId, source: this.source, sharedData: {}});
                const stepsExecutors: DataImportStepExecutor[] = this.stepsExecutors();
                if(stepsExecutors?.length > 0) {
                    await this.performSteps(jobId, stepsExecutors);
                } else {
                    throw Error('No steps defined');
                }
            }).catch(error => {
                this.emitAndLogError(error);
            });
        } catch (error) {
            this.emitAndLogError(error['message'] || error as string);
        }
        return this.jobCompletionSubject.asObservable();
    }
    
    abstract configEngineAndSteps(config: DataImportConfig): void;
    abstract stepsExecutors(): DataImportStepExecutor[];
    abstract generateUniqueJobId(): Promise<string>;
    
    async performSteps(jobId: string, steps: DataImportStepExecutor[]): Promise<void> {
        for(let step of steps) {
            try {
                step.jobId = jobId;
                let datasetSize: number;
                if(step.datasetSize) {
                    datasetSize = await step.datasetSize();
                    if (datasetSize === 0) {
                        return this.jobCompletionSubject.error(`No data found. Job ${step.stepKey}`);
                    }
                }
                let currentStepCompletion = 0;
                let offset = 0;
                // init step execution
                await this.updateJobState(jobId, step.stepKey, step.description, offset, currentStepCompletion, step.sharedData);
                if(step.preStep) {
                    await step.preStep();
                }
                if(step.chunkParams) {
                    await this.performStepsWithChunkParams(jobId, step, offset, currentStepCompletion, datasetSize);
                } else if (step.chunkSize) {
                    if(!datasetSize) {
                        throw Error('While using chunk size, dataset size must be defined');
                    }
                    await this.performStepsWithChunkSize(jobId, step, offset, currentStepCompletion, datasetSize);
                } else {
                    throw Error('Either chunk params or chunk size must be defined');
                }
                if(step.postStep) {
                    await step.postStep();
                }
                step.sharedData = null;// free up the data obj
            } catch (error) {
                this.emitAndLogError(error['message'] || error as string);
            }
        }
        this.jobCompletionSubject.next({jobId, currentStep: null, message: `job finished: ${jobId}`, finished: true});
        this.jobCompletionSubject.complete();
    }

    protected async performStepsWithChunkSize(jobId: string, step: DataImportStepExecutor, offset: number, currentStepCompletion: number, datasetSize: number): Promise<void> {
        do {
            const limit = await step.chunkSize();
            await this.performStep(step, {offset, limit});
            offset += limit;
            currentStepCompletion = Math.floor(Math.min(offset / datasetSize * 100, 100));
            await this.updateJobState(jobId, step.stepKey, step.description, offset, currentStepCompletion, step.sharedData);
        } while (offset < datasetSize);
    }

    protected async performStepsWithChunkParams(jobId: string, step: DataImportStepExecutor, offset: number, currentStepCompletion: number, datasetSize: number): Promise<void> {
        const chunkParams = await step.chunkParams();
        for (let params of chunkParams) {
            const sourceItemsProcessed = await this.performStep(step, params);
            offset += sourceItemsProcessed;
            currentStepCompletion = Math.floor(Math.min(offset / (datasetSize || offset) * 100, 100));
            await this.updateJobState(jobId, step.stepKey, step.description, offset, currentStepCompletion, step.sharedData);
        }
    }

    async performStep(step: DataImportStepExecutor, params: any): Promise<number> {
        const sourceData = await step.read(params);
        const resultData = await step.process(sourceData);
        await step.write(resultData);
        return Promise.resolve(sourceData.length);
    }

    emitAndLogError(err: string): void {
        console.error(err);
        this.jobCompletionSubject.error(err);
    }

    async updateJobState(jobId: string, stepKey: string, message: string, offset: number, percentage: number, sharedData: any): Promise<void> {
        this._currentStep = {
            id: stepKey, 
            jobId,
            offset, 
            completion: percentage,
            lastUpdated: new Date().getTime()
        }
        
        //this._queueService.enqueue(jobId, {step: this._currentStep, sharedData, message});
        //this._queueService.executeQueue(jobId, async item => {
            await this._dataImportProvider.updateJobSharedData(jobId, sharedData);
            await this._dataImportProvider.updateStepProgress(jobId, this._currentStep);
            this.jobCompletionSubject.next({
                jobId,
                currentStep: this._currentStep, 
                message: message,
                finished: false
            });
        //});
    }
}
