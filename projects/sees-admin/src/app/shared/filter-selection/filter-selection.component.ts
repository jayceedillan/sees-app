import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Self,
  inject,
  signal,
} from '@angular/core';
import { UnsubscribeService } from '../../../../../../common/UnsubscribeService';
import { EventsService } from '../../admin/events/service/events.service';
import { SportsService } from '../../admin/sports/service/sports.service';
import { combineLatest, map } from 'rxjs';
import { NamedValue } from '../../admin/namedValue.interface';
import {
  ButtonComponent,
  DatePickerComponent,
  DropDownListComponent,
  DropDownSearchComponent,
} from '../../../../../sees-lib/src/public-api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'sees-app-filter-selection',
  standalone: true,
  templateUrl: './filter-selection.component.html',
  styleUrl: './filter-selection.component.scss',
  providers: [UnsubscribeService],
  imports: [
    DropDownListComponent,
    DatePickerComponent,
    ButtonComponent,
    CommonModule,
    DropDownSearchComponent,
  ],
})
export class FilterSelectionComponent implements OnInit {
  @Input() isShowElueements = true;
  @Input() isShowDatePicker = true;
  @Input() title = 'Schedule Generation';
  @Input() isShowAddButton = false;
  @Input() buttonText = 'Add new Schedule';
  @Output() addNew = new EventEmitter<void>();
  @Output() selectedChangedEvent = new EventEmitter<number>();
  @Output() selectedChangedSport = new EventEmitter<number>();
  @Output() dateChanged = new EventEmitter<Date>();
  @Output() refresh = new EventEmitter<void>();

  public sports = signal<NamedValue[]>([]);
  public events = signal<NamedValue[]>([]);
  public currentDate = signal<Date>(new Date());
  public eventId = signal<number>(0);
  public sportId = signal<number>(0);

  private eventsService = inject(EventsService);
  private sportsService = inject(SportsService);

  constructor(@Self() private unsub: UnsubscribeService) {}

  ngOnInit(): void {
    this.loadDatas();
  }

  private loadDatas(): void {
    this.unsub.subs = combineLatest([
      this.eventsService.getAllEvents().pipe(
        map((events) =>
          events.map((event) => ({
            name: event.eventName,
            value: event.eventID,
          }))
        )
      ),
      this.sportsService.getAllSports().pipe(
        map((sports) =>
          sports.map((sport) => ({
            name: sport.sportName,
            value: sport.sportID,
          }))
        )
      ),
    ]).subscribe(([events, sports]) => {
      this.events.set(events);
      this.sports.set(sports);
    });
  }

  public onChangedEvent(selectedData: NamedValue): void {
    this.eventId.set(selectedData.value);
    this.selectedChangedEvent.emit(selectedData.value);
  }

  public onChangedSport(selectedData: NamedValue): void {
    this.sportId.set(selectedData.value);
    this.selectedChangedSport.emit(selectedData.value);
  }
}
