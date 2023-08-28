import { Subject } from "rxjs";

/**
 * Represents a simple stopwatch, with start/stop functionality.
 * The watch is considered started unless the flag _stopped is set to true.
 * The current time display is given by the difference between _startTime timestamp and current timestamp.
 */
export class Stopwatch {

  /**
   * Timestamp in milliseconds
   */
  startTime: number;
  private _stopped = false;
  /**
   * Number of seconds from start time to stop time
  */
  watchTime: number;

  /**
    * Emits the timestamp representing when the watch stopped in milliseconds
    */
  private _watchStopped = new Subject<number>();
  watchStopped$ = this._watchStopped.asObservable();
  private _autoStopped = new Subject<void>();
  autoStopped$ = this._autoStopped.asObservable();
  /**
   * Emits the timestamp representing when watch started in milliseconds
   */
  private _watchStarted = new Subject<number>();
  watchStarted$ = this._watchStarted.asObservable();
  /**
   * Number of seconds until the watch auto stops
   */
  autoStopTime?: number

  /**
   * @param autoStopTime Number of seconds when stopwatch should emit autoStopTriggered
   */
  constructor(
  ) {
  }

  get stopped() {
    return this._stopped;
  }

  public startOrResume(): number {
    this._stopped = false;
    if (!this.startTime) {
      this.startTime = new Date().getTime();
    }
    this.rollWatch();
    this._watchStarted.next(this.startTime);
    this._watchStarted.complete();
    return this.startTime;
  }

  /**
   * Signals stoppage.
   */
  public stop(): number {
    this._stopped = true;
    this._watchStopped.next(new Date().getTime());
    this._watchStopped.complete();
    return this.watchTime;
  }

  /**
   * Calculates the difference in seconds between end time and start time.
   * If end time is not provided, endTime is considered to be now.
   *
   * @param startTime start time in unix epoch milliseconds
   * @param endTime end time in unix epoch milliseconds
   */
  public getTimeDiffInSeconds(startTime: number, endTime?: number): number {
    endTime = endTime || new Date().getTime();
    return Math.floor((endTime - startTime) / 1000);
  }

  /**
   * Calls recursively itself to update _watchTime and _defaultDisplay values.
   */
  private rollWatch(): void {
    if (this._stopped) {
      return;
    }
    this.watchTime = this.getTimeDiffInSeconds(this.startTime);
    if (this.autoStopTime && this.watchTime >= this.autoStopTime) {
      this._stopped = true;
      this._autoStopped.next();
      this._autoStopped.complete();
    }
    setTimeout(() => this.rollWatch(), 1000);
  }
}
