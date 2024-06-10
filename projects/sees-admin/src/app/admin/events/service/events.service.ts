import { HttpClient } from '@angular/common/http';
import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import {
  Observable,
  debounceTime,
  distinctUntilChanged,
  map,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { LIMIT } from '../../../../../../../conts/app.const';
import { environment } from '../../../../../environment/environment';
import { ResponseData } from '../../Response.interface';
import { Events } from '../event.interface';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);
  private events = signal<ResponseData<Events[]>>({
    data: [],
    totalCount: 0,
  });

  public loadEvents(pageNumber: number): Observable<ResponseData<Events[]>> {
    return this.http
      .get<ResponseData<Events[]>>(
        `${this.apiUrl}/Event?pageNumber=${pageNumber}&pageSize=${LIMIT}`
      )
      .pipe(
        map((responseData) => {
          return {
            data: responseData.data,
            totalCount: responseData.totalCount,
          };
        }),
        take(1),
        tap((responseData) => this.events.set(responseData))
      );
  }

  public getAllEvents(): Observable<Events[]> {
    return this.http.get<Events[]>(`${this.apiUrl}/Event/getAll`);
  }

  public loadEventAndSearch(
    pageNumber: number,
    query = ''
  ): Observable<ResponseData<Events[]>> {
    return of(query).pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((searchQuery: string) =>
        this.searchEvents(searchQuery, pageNumber)
      ),
      take(1),
      tap((responseData) => this.events.set(responseData))
    );
  }

  private searchEvents(
    searchQuery: string,
    pageNumber: number
  ): Observable<ResponseData<Events[]>> {
    return this.http
      .get<ResponseData<Events[]>>(
        `${this.apiUrl}/Event/search?pageNumber=${pageNumber}&pageSize=${LIMIT}&searchQuery=${searchQuery}`
      )
      .pipe(
        map((responseData) => ({
          data: responseData.data,
          totalCount: responseData.totalCount,
        }))
      );
  }

  public addEvents(event: Events): Observable<Events> {
    return this.http.post<Events>(`${this.apiUrl}/Event`, event);
  }

  public updateEvents(event: Events): Observable<Events> {
    return this.http.put<Events>(
      `${this.apiUrl}/Event/${event.eventID}`,
      event
    );
  }

  public deleteEvent(eventId: number): Observable<Events> {
    return this.http.delete<Events>(`${this.apiUrl}/Event/${eventId}`);
  }

  public setEvent(events: ResponseData<Events[]>): void {
    this.events.set(events);
  }

  public updateEventsIsActive(event: Events): Observable<Events> {
    return this.http.put<Events>(
      `${this.apiUrl}/Event/updateActive/${event.eventID}`,
      event
    );
  }

  public getEvents(): WritableSignal<ResponseData<Events[]>> {
    return this.events;
  }
}
