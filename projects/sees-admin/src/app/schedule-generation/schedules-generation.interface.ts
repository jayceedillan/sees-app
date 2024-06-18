import { Events } from '../admin/events/event.interface';
import { Team } from '../admin/team/team-managment.interface';
import { Venue } from '../admin/venue/venue.interface';

export interface CombinedEventSchedule {
  mainEventSchedule: MainEventSchedule;
  eventSchedule: EventSchedule[];
}

export interface MainEventSchedule {
  mainEventScheduleID: number;
  scheduleDate: Date;
  sportID: number;
  eventID: number;
}

export interface EventSchedule {
  id?: string;
  scheduleID?: number;
  mainEventSchedulesID?: number;
  startTime?: Date | string;
  team1ID?: number;
  team1?: Team;
  team2ID?: number;
  team2?: Team;
  venueID?: number;
  score1?: number;
  score2?: number;
  venue?: Venue;
  isClearStartTime?: boolean;
  isClearEndTime?: boolean;
  status?: string;
  isEditScore?: boolean;
  isInValid?: boolean;
}

export interface ScheduleGeneration {
  scheduleID?: number;
  event?: Events;
  startTime?: string;
  endTime?: string;
  team1?: Team;
  team2?: Team;
  venue?: Venue;
  eventID?: number;
  team1ID?: number;
  team2ID?: number;
  isClearStartTime?: boolean;
  isClearEndTime?: boolean;
}

export interface ScheduledEvent {
  eventSchedule: EventSchedule;
  index: number;
}
