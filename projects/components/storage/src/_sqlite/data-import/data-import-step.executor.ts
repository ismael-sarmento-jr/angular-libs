import { SQLiteService } from "../sqlite.service";
import { DataImportConfig } from "./data-import";


export interface DataImportStepExecutor {
    jobId: string;
    stepKey: string;
    description: string;
    config: DataImportConfig;
    databaseService: SQLiteService;
    sharedData?: any;
    datasetSize: () => Promise<number>;
    chunkSize?: () => Promise<number>;
    chunkParams?: () => Promise<any[]>;
    
    preStep?(): Promise<void>;
    read(params?: any): Promise<any>;
    process(sourceData: any): Promise<any>;
    write(resultData: any): Promise<void>;
    postStep?(): Promise<void>;
}

export default abstract class BaseDataImportStepExecutor  implements DataImportStepExecutor {
    jobId: string;
    stepKey: string;
    description: string;
    sharedData: any = {};
    databaseService: SQLiteService;
    config: DataImportConfig;
    
    async read(params?: any): Promise<any> {
        let result: any[];
        try {
            result = await this.databaseService.executeQuery(this.getSqlStatement(params));
        } catch (error) {
            console.error(error);
            return Promise.reject(`Error while reading data. Step ${this.stepKey} ${this.description}. ${error.message || error}`);
        }
        return Promise.resolve(result);
    }
    abstract process(sourceData: any): Promise<any>;
    abstract write(resultData: any): Promise<void>;
    abstract getSqlStatement(params?: any): string;
    abstract datasetSize(): Promise<number>;
    
}