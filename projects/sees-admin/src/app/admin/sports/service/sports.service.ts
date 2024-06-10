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
import { Sport } from '../sport.interace';

@Injectable({
  providedIn: 'root',
})
export class SportsService {
  private http = inject(HttpClient);

  private apiUrl = environment.apiUrl;

  private sports = signal<ResponseData<Sport[]>>({
    data: [],
    totalCount: 0,
  });

  public getAllSports(): Observable<Sport[]> {
    return this.http.get<Sport[]>(`${this.apiUrl}/Sport`);
  }

  public loadSports(pageNumber: number): Observable<ResponseData<Sport[]>> {
    return this.http
      .get<ResponseData<Sport[]>>(
        `${this.apiUrl}/Sport/getAllSports?pageNumber=${pageNumber}&pageSize=${LIMIT}`
      )
      .pipe(
        map((responseData) => {
          return {
            data: responseData.data,
            totalCount: responseData.totalCount,
          };
        }),
        tap((responseData) => {
          this.sports.set(responseData);
        })
      );
  }

  public loadSportAndSearch(
    pageNumber: number,
    query = ''
  ): Observable<ResponseData<Sport[]>> {
    return of(query).pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((searchQuery: string) =>
        this.searchSports(searchQuery, pageNumber)
      ),
      take(1),
      tap((responseData) => {
        this.sports.set(responseData);
      })
    );
  }

  private searchSports(
    searchQuery: string,
    pageNumber: number
  ): Observable<ResponseData<Sport[]>> {
    return this.http
      .get<ResponseData<Sport[]>>(
        `${this.apiUrl}/Sport/search?pageNumber=${pageNumber}&pageSize=${LIMIT}&searchQuery=${searchQuery}`
      )
      .pipe(
        map((responseData) => ({
          data: responseData.data,
          totalCount: responseData.totalCount,
        }))
      );
  }

  public setSport(sports: ResponseData<Sport[]>): void {
    this.sports.set(sports);
  }

  public addTeam(sport: Sport): Observable<Sport> {
    return this.http.post<Sport>(`${this.apiUrl}/Sport`, sport);
  }

  public updateSport(sport: Sport): Observable<Sport> {
    return this.http.put<Sport>(`${this.apiUrl}/Sport/${sport.sportID}`, sport);
  }

  public deleteSport(sportId: number): Observable<Sport> {
    return this.http.delete<Sport>(`${this.apiUrl}/Sport/${sportId}`);
  }

  public getSports(): WritableSignal<ResponseData<Sport[]>> {
    return this.sports;
  }
}
