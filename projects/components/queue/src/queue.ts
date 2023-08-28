import { Subject } from "rxjs";

export enum QueueState {
    NEW,
    RUNNING,
    FINISHED
}
export type QueueInfo = {subject: Subject<boolean>, queue: any[], state: QueueState};

