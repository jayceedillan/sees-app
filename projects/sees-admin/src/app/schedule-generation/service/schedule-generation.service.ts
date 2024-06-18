import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';

import {
  CombinedEventSchedule,
  ScheduleGeneration,
} from '../schedules-generation.interface';
import { environment } from '../../../../environment/environment';
import { ResponseData } from '../../admin/Response.interface';
import { LIMIT } from '../../../../../../conts/app.const';

@Injectable({
  providedIn: 'root',
})
export class ScheduleGenerationService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  private scheduleGeneration = signal<ResponseData<ScheduleGeneration[]>>({
    data: [],
    totalCount: 0,
  });

  // private scheduleGenerationResponseSubject =
  //   new BehaviorSubject<ResponseData<ScheduleGeneration> | null>(null);
  // public scheduleGenerationResponse$ =
  //   this.scheduleGenerationResponseSubject.asObservable();
  // private eventSchedule = signal<EventSchedule[]>([]);

  // private eventScheduleSubject = new BehaviorSubject<EventSchedule[]>([]);
  // public eventSchedule$ = this.eventScheduleSubject.asObservable();

  public loadScheduleGeneration(
    pageNumber: number
  ): Observable<ResponseData<ScheduleGeneration[]>> {
    return this.http
      .get<ResponseData<ScheduleGeneration[]>>(
        `${this.apiUrl}/EventSchedule?pageNumber=${pageNumber}&pageSize=${LIMIT}`
      )
      .pipe(
        map((responseData) => {
          return {
            data: responseData.data,
            totalCount: responseData.totalCount,
          };
        }),
        tap((responseData) => {
          this.scheduleGeneration.set(responseData);
        })
      );
  }

  public getEventSchedulesByDateSportIdAndEventId(
    scheduleDate: string,
    sportId: number,
    eventId: number
  ): Observable<CombinedEventSchedule> {
    return this.http.get<CombinedEventSchedule>(
      `${this.apiUrl}/EventSchedule/getSchedulesByDateSportEvent/${scheduleDate}/${sportId}/${eventId}`
    );
  }

  public addSchedule(
    combinedEventSchedule: CombinedEventSchedule
  ): Observable<boolean> {
    return this.http.post<boolean>(
      `${this.apiUrl}/EventSchedule/addSchedule`,
      combinedEventSchedule
    );
  }
}
