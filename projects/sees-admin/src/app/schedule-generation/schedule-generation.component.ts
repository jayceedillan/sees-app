import { Component, OnInit, Self, inject, signal } from '@angular/core';
import { FilterSelectionComponent } from '../shared/filter-selection/filter-selection.component';
import {
  CombinedEventSchedule,
  EventSchedule,
} from './schedules-generation.interface';
import { UnsubscribeService } from '../../../../../common/UnsubscribeService';
import { ScheduleGenerationService } from './service/schedule-generation.service';
import { FormatDateService } from '../../../../../service/format-date.service';
import {
  EMPTY,
  combineLatest,
  distinctUntilChanged,
  filter,
  interval,
  map,
  switchMap,
} from 'rxjs';
import {
  ButtonComponent,
  DropDownSearchComponent,
  TimePickerComponent,
} from '../../../../sees-lib/src/public-api';
import { isEqual } from 'lodash';
import { TeamsService } from '../admin/team/service/teams.service';
import { VenuesService } from '../admin/venue/service/venues.service';
import { NotificationService } from '../../../../../service/notification.service';
import { NamedValue } from '../admin/namedValue.interface';
import { CustomDropdownComponent } from './custom-dropdown/custom-dropdown.component';

@Component({
  selector: 'sees-app-schedule-generation',
  standalone: true,
  templateUrl: './schedule-generation.component.html',
  styleUrl: './schedule-generation.component.scss',
  providers: [UnsubscribeService],
  imports: [
    FilterSelectionComponent,
    DropDownSearchComponent,
    TimePickerComponent,
    ButtonComponent,
    CustomDropdownComponent,
  ],
})
export class ScheduleGenerationComponent implements OnInit {
  public selectedEventID = signal<number>(0);
  public selectedSportID = signal<number>(0);
  public selectedDate = signal<Date>(new Date());
  public eventSchedules = signal<EventSchedule[]>([]);
  public teams = signal<NamedValue[]>([]);
  public venues = signal<NamedValue[]>([]);

  private scheduleGenerationService = inject(ScheduleGenerationService);
  private formatDateService = inject(FormatDateService);
  private teamService = inject(TeamsService);
  private venueService = inject(VenuesService);
  private notificationService = inject(NotificationService);

  teamAOptions: string[] = ['Option 1', 'Option 2', 'Option 3'];
  teamBOptions: string[] = ['Option A', 'Option B', 'Option C'];

  constructor(@Self() private unsub: UnsubscribeService) {}

  ngOnInit(): void {
    this.loadDatas();
  }

  private loadDatas(): void {
    this.unsub.subs = combineLatest({
      teams: this.teamService
        .getAllTeams()
        .pipe(
          map((teams) =>
            teams.map((team) => ({ name: team.teamName, value: team.teamID }))
          )
        ),
      venues: this.venueService.getAllVenues().pipe(
        map((venues) =>
          venues.map((venue) => ({
            name: venue.venueName,
            value: venue.venueID,
          }))
        )
      ),
    }).subscribe(({ teams, venues }) => {
      this.teams.set(teams);
      this.venues.set(venues);
      // this.eventSchedules = eventSchedules;
      // if (!isEqual(this.eventSchedules, eventSchedules)) {
      //   this.eventSchedules = eventSchedules;
      //   this.scheduleGenerationService.seteventSchedule(this.eventSchedules);
      // }
    });
  }

  public onSelectedChangedEvent(id: number): void {
    this.selectedEventID.set(id);
    this.startPeriodicScheduleCheck();
  }

  public onSelectedChangedSport(id: number): void {
    this.selectedSportID.set(id);
    this.startPeriodicScheduleCheck();
  }

  public onDateChanged(date: Date): void {
    this.selectedDate.set(date);
    this.startPeriodicScheduleCheck();
  }

  private startPeriodicScheduleCheck(): void {
    this.unsub.subs = interval(4000)
      .pipe(
        filter(
          () =>
            !!this.selectedDate() &&
            !!this.selectedSportID() &&
            !!this.selectedEventID()
        ),
        switchMap(() => {
          const date = this.selectedDate();
          const sportId = this.selectedSportID();
          const eventId = this.selectedEventID();
          if (date && sportId && eventId) {
            return this.scheduleGenerationService.getEventSchedulesByDateSportIdAndEventId(
              date.toDateString(),
              sportId,
              eventId
            );
          } else {
            return EMPTY;
          }
        })
      )
      .subscribe({
        next: (combinedEventSchedule: CombinedEventSchedule) => {
          // this.eventSchedules.set(combinedEventSchedule);
        },
        error: (error) => {
          console.error('Error fetching event schedules:', error);
        },
      });
  }

  private getEventSchedulesByDateSportIdAndEventId(): void {
    this.unsub.subs = this.scheduleGenerationService
      .getEventSchedulesByDateSportIdAndEventId(
        this.selectedDate().toDateString(),
        this.selectedSportID(),
        this.selectedEventID()
      )
      .subscribe({
        next: (combinedEventSchedule: CombinedEventSchedule) => {
          this.eventSchedules.set(combinedEventSchedule.eventSchedule);
        },
        error: (error) => {
          console.error('Error fetching event schedules:', error);
        },
      });
  }
}
