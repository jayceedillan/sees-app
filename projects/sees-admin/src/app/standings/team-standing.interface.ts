import { Team } from '../admin/team/team-managment.interface';

export interface TeamStanding {
  team: Team;
  wins: number;
  losses: number;
  mainEventScheduleID: number;
  sportID: number;
}

export interface TeamOverallStandings {
  overAllTeamStandingID: number;
  teamID: number;
  team: Team;
  eventID: number;
  gold: number;
  zilver: number;
  bronze: number;
}
