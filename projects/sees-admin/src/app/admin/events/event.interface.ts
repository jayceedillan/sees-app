import { Venue } from '../venue-management/venue.interface';

export interface Events {
  eventID: number;
  eventCode: string;
  eventName: string;
  eventDate: string;
  startTime: string | Date;
  duration: number;
  venueID: number;
  venue: Venue;
  venueName: string;
  isActive: boolean;
}
