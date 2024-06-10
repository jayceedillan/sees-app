import { Injectable, OnDestroy, inject, signal } from '@angular/core';
import { ResponseData } from '../../Response.interface';
import { Team } from '../team-managment.interface';
import {
  BehaviorSubject,
  Observable,
  Subject,
  debounceTime,
  distinctUntilChanged,
  map,
  of,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { LIMIT } from '../../../../../../../conts/app.const';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class TeamsService {
  private http = inject(HttpClient);

  private apiUrl = environment.apiUrl;
  private teams = signal<ResponseData<Team[]>>({
    data: [],
    totalCount: 0,
  });

  public loadTeams(pageNumber: number): Observable<ResponseData<Team[]>> {
    return this.http
      .get<ResponseData<Team[]>>(
        `${this.apiUrl}/Team?pageNumber=${pageNumber}&pageSize=${LIMIT}`
      )
      .pipe(
        map((responseData) => {
          return {
            data: responseData.data,
            totalCount: responseData.totalCount,
          };
        }),
        tap((responseData) => this.teams.set(responseData))
      );
  }

  public addTeam(team: Team): Observable<Team> {
    return this.http.post<Team>(`${this.apiUrl}/Team`, team);
  }

  public updateTeam(team: Team): Observable<Team> {
    return this.http.put<Team>(`${this.apiUrl}/Team/${team.teamID}`, team);
  }

  public deleteTeam(teamId: number): Observable<Team> {
    return this.http.delete<Team>(`${this.apiUrl}/Team/${teamId}`);
  }

  public getAllTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(`${this.apiUrl}/Team/getAll`);
  }

  public search(
    query = '',
    pageNumber: number
  ): Observable<ResponseData<Team[]>> {
    return of(query).pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((searchQuery: string) =>
        this.searchTeams(searchQuery, pageNumber)
      )
    );
  }

  private searchTeams(
    searchQuery: string,
    pageNumber: number
  ): Observable<ResponseData<Team[]>> {
    return this.http
      .get<ResponseData<Team[]>>(
        `${this.apiUrl}/Team/search?pageNumber=${pageNumber}&pageSize=${LIMIT}&searchQuery=${searchQuery}`
      )
      .pipe(
        map((responseData) => ({
          data: responseData.data,
          totalCount: responseData.totalCount,
        }))
      );
  }
}
