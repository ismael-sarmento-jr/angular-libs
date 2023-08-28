
export interface ImportJob {
    id: string;
    source: string;
    description?: string;
    sharedData: any;
}
export interface ImportStep {
    id: string;
    jobId: string;
    lastUpdated: number; // timestamp
    offset: number;
    /**
     * Completion percentage, between 0 and 100
     */
    completion: number;
}
export interface JobProgress {
    jobId: string;
    currentStep: ImportStep;
    message: string;
    finished: boolean;
}
export interface JobInteractionInfo {
    
    interaction: JobInteraction,
    step: string,
    data: any;
}
export interface JobInteraction {
    id: any;
    /**
     * What is the user supposed to do; eg: Choose entries to be imported
     */
    description: string;
}

export interface DataImportConfig {
    databaseName: string;
    groupId: string;
    dbLocation: string;
}

//FIXME too specific; relocate model
export interface FetchedPlayers {
    /**
     * Players to be auto imported
     */
    newPlayers: any[];
    /**
     * Players not auto imported, given names already exist in database
     */
    existingPlayers: Map<string, any[]>;
}

export interface ImportMetadata {
    /**
     * Description for the source of the data
     */
    data_source: string;
    /**
     * Timestamp when the data was imported
     */
    import_date: number;
}
