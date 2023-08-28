import { Injectable } from '@angular/core';

export interface IonValue {
  text: string;
  value: number;
  columnIndex: number;
}

export interface IonDate {
  day: IonValue;
  month: IonValue;
  year: IonValue;
}

@Injectable({
  providedIn: 'root'
})
export class DateTimeService {

  constructor() { }

  /**
   * Checks if the parameter date is today, ignoring hours, minutes and seconds.
   */
  isLocalDateToday(date: Date): boolean {
    const today = new Date();
    return (
        today.getFullYear() === date.getFullYear() &&
        today.getMonth() === date.getMonth() &&
        today.getDate() === date.getDate()
    );
  }

  isLocalDateFormat(dateStr: string): boolean {
    const dateStrPattern = /(\d{4})-(\d{2}|\d{1})-(\d{2}|\d{1})/;
    return dateStrPattern.test(dateStr);
  }

  /**
   * @return date string in the format yyyy-MM-dd
   */
  fromDateToStandardDateStr(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toLocaleString('en', {minimumIntegerDigits:2});
    const day = date.getDate().toLocaleString('en', {minimumIntegerDigits:2});
    return `${year}-${month}-${day}`;
  }

  fromStandardDateStrToDate(dateStr: string): Date {
    if(this.isLocalDateFormat(dateStr)){
      const date = dateStr.split('-');
      return new Date(+date[0], +date[1] - 1, +date[2]);
    } else  {
      throw Error('Invalid date format. Should be yyyy-MM-dd');
    }
  }

  fromIonDateToApiDateStr(date: IonDate): string {
    return `${date.day.value}/${date.month.value}/${date.year.value}`;
  }

  fromIonDateToStandardDateStr(date: IonDate): string {
    return `${date.year.value}-${this.pad(date.month.value)}-${this.pad(date.day.value)}`;
  }

  /**
   * @return 0 if dateStr is today; -1 dateStr is before today; 1 dateStr is after today.
   */
  public compareToTodaysDate(dateStr: string): number {
    if(!dateStr) {
      throw Error('Param `dateStr` is not defined')
    }
    const today = new Date();
    const date = new Date(dateStr);
    return this.isLocalDateToday(this.fromStandardDateStrToDate(dateStr)) ? 0
      : date < today ? -1
        : 1;
  }

  /**
   * Alternative to Date.toISOString, to adjust timezone locally; useful for testing.
   */
  toIsoString(date: Date) {
    const tzo = -date.getTimezoneOffset();
    const dif = tzo >= 0 ? '+' : '-';
    return `${date.getFullYear()}-${this.pad(date.getMonth() + 1)}-${this.pad(date.getDate())}`+
      `T${this.pad(date.getHours())}:${this.pad(date.getMinutes())}:${this.pad(date.getSeconds())}${dif}`+
      `${this.pad(Math.floor(Math.abs(tzo) / 60))}:${this.pad(Math.abs(tzo) % 60)}`;
  };

  pad(num): string {
    return (num < 10 ? '0' : '') + num;
  }

  /**
   * @param timeStr time in format (hhhh:)mm:ss
   * @return number of seconds
   */
  fromTimeStrToSeconds(timeStr: any): number {
    const timeParts = timeStr.split(':');
    if(timeParts.length === 3) {
      return (timeParts[0] * 60 * 60 + timeParts[1] * 60 + +timeParts[2]);
    } else if(timeParts.length === 2) {
      return (timeParts[0] * 60 + +timeParts[1]);
    } else {
      throw Error(`Wrong param format: ${timeStr}`);
    }
  }

  /**
   * Formats the number of seconds into '(hhhh:)mm:ss'.
   * It doesn't validate format, neither validates that minutes and seconds are smaller than 59.
   *
   * @param time number of seconds
   */
  public secondsToDefaultWatchFormat(time: number): string {
    const seconds = (time % 60 + '').padStart(2, '0');
    const minutes = (Math.floor(time / 60) % 60 + '').padStart(2, '0');
    const hours = Math.floor(time / 3600);
    let watchDisplay = `${minutes}:${seconds}`;
    watchDisplay = hours ? `${(hours + '').padStart(2, '0')}:${watchDisplay}` : watchDisplay;
    return watchDisplay;
  }

  /**
   * Calculates the difference between start time and end time in seconds and transforms it
   * in time duration in the format mm'ss''
   *
   * @param watchTime number of seconds
   * @return time formatted to mm'ss''
   */
  public toQuotesFormat(watchTime: number): string {
    const seconds = (watchTime % 60 + '').padStart(2, '0');
    const minutes = Math.floor(watchTime/60);
    return `${minutes}\'${seconds}\'\'`;
  }
}
