import { Sport } from '../sports/sport.interace';
import { Team } from '../team/team-managment.interface';

export interface PlayersWithSports {
  player: Players;
  sportIds: number[];
}

export interface Players {
  playerID: number;
  firstName: string;
  lastName: string;
  middleInitial: string;
  contactNo: string;
  emailAddress: string;
  dateOfBirth: Date;
  height: number;
  weight: number;
  teamID: number;
  team: Team;
  educationalLevelID: number;
  educationalLevel: EducationalLevel;
  profilePic: string | null | ArrayBuffer;
  playerSports: PlayerSport[];
  sports: string[];
  teamName: string;
  level: string;
  birthDate: string;
  gender: string;
  age: number;
}

export interface EducationalLevel {
  educationalLevelID: number;
  educationalLevelName: string;
}

export interface PlayerSport {
  playerID: number;
  sportID: number;
  sport: Sport;
}
