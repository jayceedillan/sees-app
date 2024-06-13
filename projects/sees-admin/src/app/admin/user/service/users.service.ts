import { HttpClient } from '@angular/common/http';
import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { environment } from '../../../../../environment/environment';
import { Designation, Role, User } from '../user.interface';
import { ResponseData } from '../../Response.interface';
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

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private http = inject(HttpClient);

  private apiUrl = environment.apiUrl;

  private users = signal<ResponseData<User[]>>({
    data: [],
    totalCount: 0,
  });

  constructor() {}

  public loadUserAndSearch(
    pageNumber: number,
    query = ''
  ): Observable<ResponseData<User[]>> {
    return of(query).pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((searchQuery: string) =>
        this.searchTeams(searchQuery, pageNumber)
      ),
      take(1),
      tap((responseData) => {
        this.users.set(responseData);
      })
    );
  }

  private searchTeams(
    searchQuery: string,
    pageNumber: number
  ): Observable<ResponseData<User[]>> {
    return this.http
      .get<ResponseData<User[]>>(
        `${this.apiUrl}/User/search?pageNumber=${pageNumber}&pageSize=${LIMIT}&searchQuery=${searchQuery}`
      )
      .pipe(
        map((responseData) => ({
          data: responseData.data,
          totalCount: responseData.totalCount,
        }))
      );
  }

  public addData(data: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/User`, data);
  }

  public getDesignation(): Observable<Designation[]> {
    return this.http.get<Designation[]>(`${this.apiUrl}/Designation`);
  }

  public getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.apiUrl}/Role`);
  }

  public deleteData(id: number): Observable<User> {
    return this.http.delete<User>(`${this.apiUrl}/User/${id}`);
  }

  public updateData(data: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/User/${data.userID}`, data);
  }

  public getUsers(): WritableSignal<ResponseData<User[]>> {
    return this.users;
  }
}
