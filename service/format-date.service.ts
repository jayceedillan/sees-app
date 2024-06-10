import { Injectable } from '@angular/core';
import { format, parse } from 'date-fns';

@Injectable({
  providedIn: 'root',
})
export class FormatDateService {
  public formatTime(time: Date): string {
    const startTime = new Date(time);

    let hours = startTime.getHours();
    const meridian = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours.toString().padStart(2, '0')}:${startTime
      .getMinutes()
      .toString()
      .padStart(2, '0')} ${meridian}`;
  }

  public formatDate(date: Date): string {
    return new Date(date).toISOString().split('T')[0];
  }

  public getFormattedDateTime(timeString: string): Date {
    // Parse the time string into a Date object
    const parsedTime = parse(timeString, 'hh:mm aa', new Date());

    // Format the Date object to any desired format
    return new Date(format(parsedTime, "yyyy-MM-dd'T'HH:mm:ss"));
  }

  // public convertDate(date: Date): string {
  //   const day = this.padZero(date.getDate());
  //   const month = this.padZero(date.getMonth() + 1);
  //   const year = date.getFullYear();
  //   return `${month}/${day}/${year}`;
  // }

  // public padZero(value: number): string {
  //   return value < 10 ? `0${value}` : value.toString();
  // }
}
