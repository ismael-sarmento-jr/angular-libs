import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { QueueInfo, QueueState } from './queue';

@Injectable()
export class QueueService {

  /**
   * Map where the key matches the key for the collection and the value is the array of objects to be pushed to the collection
   */
  private _mappedQueues = new Map<string, QueueInfo>();//TODO keep small max entries size and clean up empty queues

  constructor() { }

  public enqueue(key: string, item: any): Observable<boolean> {
    const queueInfo: QueueInfo = this._mappedQueues.get(key);
    if(!queueInfo) {
      const subject = new ReplaySubject<boolean>(1);
      this._mappedQueues.set(key, {subject, queue: [item], state: QueueState.NEW}
      );
      return subject.asObservable();
    } else {
      queueInfo.queue.push(item);
      return queueInfo.subject.asObservable();
    }
  }

  async executeQueue(key: string, task: (item: any) => Promise<any>): Promise<void> {
    const queueInfo: QueueInfo = this._mappedQueues.get(key);
    if(!queueInfo) {
      queueInfo.subject.error(`Queue not found with key: ${key}`);
      return Promise.reject();
    }
    try {
      if(queueInfo.state === QueueState.RUNNING) {
        return Promise.resolve();
      }
      queueInfo.state = QueueState.RUNNING;
      const queue = queueInfo.queue;
      while(queue && queue.length) {
          const item = queue.shift();
          await task(item);
      }
      queueInfo.state = QueueState.FINISHED;
      queueInfo.subject.next(true);
    } catch (error) {
      queueInfo.subject.error(`Couldn't execute queue: ${error}`);
      return Promise.reject();
    }
  }
}
