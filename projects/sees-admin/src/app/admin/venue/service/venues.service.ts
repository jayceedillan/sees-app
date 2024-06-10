import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
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
import { Venue } from '../venue.interface';

@Injectable({
  providedIn: 'root',
})
export class VenuesService {
  private apiUrl = environment.apiUrl;

  private http = inject(HttpClient);
  private venues = signal<ResponseData<Venue[]>>({
    data: [],
    totalCount: 0,
  });

  public getAllVenues(): Observable<Venue[]> {
    return this.http.get<Venue[]>(`${this.apiUrl}/Venue/getAll`);
  }

  public loadVenues(pageNumber: number): Observable<ResponseData<Venue[]>> {
    return this.http
      .get<ResponseData<Venue[]>>(
        `${this.apiUrl}/Venue?pageNumber=${pageNumber}&pageSize=${LIMIT}`
      )
      .pipe(
        map((responseData) => {
          return {
            data: responseData.data,
            totalCount: responseData.totalCount,
          };
        }),
        take(1),
        tap((responseData) => this.venues.set(responseData))
      );
  }

  public loadVenuesAndSearch(
    pageNumber: number,
    query = ''
  ): Observable<ResponseData<Venue[]>> {
    return of(query).pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((searchQuery: string) =>
        this.searchVenues(searchQuery, pageNumber)
      )
    );
  }

  private searchVenues(
    searchQuery: string,
    pageNumber: number
  ): Observable<ResponseData<Venue[]>> {
    return this.http
      .get<ResponseData<Venue[]>>(
        `${this.apiUrl}/Venue/search?pageNumber=${pageNumber}&pageSize=${LIMIT}&searchQuery=${searchQuery}`
      )
      .pipe(
        map((responseData) => ({
          data: responseData.data,
          totalCount: responseData.totalCount,
        }))
      );
  }

  public addVenue(venue: Venue): Observable<Venue> {
    return this.http.post<Venue>(`${this.apiUrl}/Venue`, venue);
  }

  public deleteVenue(venueId: number): Observable<Venue> {
    return this.http.delete<Venue>(`${this.apiUrl}/Venue/${venueId}`);
  }

  public updateVenue(venue: Venue): Observable<Venue> {
    return this.http.put<Venue>(`${this.apiUrl}/Venue/${venue.venueID}`, venue);
  }
}
