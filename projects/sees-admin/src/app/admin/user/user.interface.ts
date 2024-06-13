import { EducationalLevel } from '../players/players.interface';
import { Team } from '../team/team-managment.interface';

export interface User {
  userID: number;
  firstName: string;
  middleName: string;
  lastName: string;
  emailAddress: string;
  contactNo: string;
  gender: string;
  username: string;
  password: string;
  roleID: string;
  educationalLevelID: number;
  educationalLevelName: string;
  educationalLevel: EducationalLevel;
  designationID: number;
  designationName: string;
  designation: Designation;
  role: Role;
  roleName: string;
  team: Team;
  teamID?: number;
  teamName: string;
}

export interface Designation {
  designationID: number;
  designationName: string;
}
export interface Role {
  roleID: number;
  roleName: string;
}
