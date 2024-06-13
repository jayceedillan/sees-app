import { HttpClient } from '@angular/common/http';
import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import {
  EducationalLevel,
  Players,
  PlayersWithSports,
} from '../players.interface';

import { ResponseData } from '../../Response.interface';
import { environment } from '../../../../../environment/environment';
import {
  Observable,
  debounceTime,
  distinctUntilChanged,
  map,
  of,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import { LIMIT } from '../../../../../../../conts/app.const';

@Injectable({
  providedIn: 'root',
})
export class PlayersService {
  private apiUrl = environment.apiUrl;

  private http = inject(HttpClient);
  private players = signal<ResponseData<Players[]>>({
    data: [],
    totalCount: 0,
  });

  public loadPlayersAndSearch(
    pageNumber: number,
    query = ''
  ): Observable<ResponseData<Players[]>> {
    return of(query).pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((searchQuery: string) =>
        this.searchPlayers(searchQuery, pageNumber)
      ),
      take(1),
      tap((responseData) => {
        this.players.set(responseData);
      })
    );
  }

  private searchPlayers(
    searchQuery: string,
    pageNumber: number
  ): Observable<ResponseData<Players[]>> {
    return this.http
      .get<ResponseData<Players[]>>(
        `${this.apiUrl}/Players/search?pageNumber=${pageNumber}&pageSize=${LIMIT}&searchQuery=${searchQuery}`
      )
      .pipe(
        map((responseData) => ({
          data: responseData.data,
          totalCount: responseData.totalCount,
        }))
      );
  }

  public getPlayers(): WritableSignal<ResponseData<Players[]>> {
    return this.players;
  }

  public onDateChanged(date: Date): number {
    const today = new Date();

    const diffMilliseconds = today.getTime() - date.getTime();

    const diffSeconds = diffMilliseconds / 1000;
    const diffMinutes = diffSeconds / 60;
    const diffHours = diffMinutes / 60;
    const diffDays = diffHours / 24;
    const diffYears = diffDays / 365.25;

    return Math.floor(diffYears);
  }

  public deletePlayer(playerId: number): Observable<Players> {
    return this.http.delete<Players>(`${this.apiUrl}/Players/${playerId}`);
  }

  public loadEducationalLevel(): Observable<EducationalLevel[]> {
    return this.http.get<EducationalLevel[]>(
      `${this.apiUrl}/Players/getAllEducationalLevel`
    );
  }

  public addPlayerWithSports(
    playersWithSports: PlayersWithSports
  ): Observable<PlayersWithSports> {
    return this.http.post<PlayersWithSports>(
      `${this.apiUrl}/Players/AddPlayerWithSports`,
      playersWithSports
    );
  }

  public loadPlayers(pageNumber: number): Observable<ResponseData<Players[]>> {
    return this.http
      .get<ResponseData<Players[]>>(
        `${this.apiUrl}/Players/search?pageNumber=${pageNumber}&pageSize=${LIMIT}`
      )
      .pipe(
        map((responseData) => ({
          data: responseData.data,
          totalCount: responseData.totalCount,
        })),
        tap((responseData) => {
          this.players.set(responseData);
        })
      );
  }

  public updatePlayer(
    playersWithSports: PlayersWithSports
  ): Observable<PlayersWithSports> {
    return this.http.put<PlayersWithSports>(
      `${this.apiUrl}/Players/UpdatePlayerWithSports`,
      playersWithSports
    );
  }
}
