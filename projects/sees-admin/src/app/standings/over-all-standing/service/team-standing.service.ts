import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environment/environment';
import {
  TeamOverallStandings,
  TeamStanding,
} from '../../team-standing.interface';

@Injectable({
  providedIn: 'root',
})
export class TeamStandingService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  public getTeamStandingBySportAndEvents(
    sportID: number,
    eventID: number
  ): Observable<TeamStanding[]> {
    return this.http.get<TeamStanding[]>(
      `${this.apiUrl}/TeamStanding/${sportID}/${eventID}`
    );
  }

  public getAllOverAllStandings(): Observable<TeamOverallStandings[]> {
    return this.http.get<TeamOverallStandings[]>(
      `${this.apiUrl}/OverTeamStanding`
    );
  }
}
