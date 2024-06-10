import { CommonModule } from '@angular/common';
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
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UnsubscribeService } from '../../../../../../../common/UnsubscribeService';
import {
  ADDED_SUCCESS,
  ERROR_MESSAGE,
} from '../../../../../../../conts/app.const';
import { FormatDateService } from '../../../../../../../service/format-date.service';
import { NotificationService } from '../../../../../../../service/notification.service';
import {
  DatePickerComponent,
  InputFieldComponent,
  ModalFormComponent,
  TimePickerComponent,
} from '../../../../../../sees-lib/src/public-api';
import { VenuesService } from '../../venue/service/venues.service';
import { Venue } from '../../venue/venue.interface';
import { Events } from '../event.interface';
import { EventsService } from '../service/events.service';

@Component({
  selector: 'sees-app-add-event',
  standalone: true,
  templateUrl: './add-event.component.html',
  styleUrl: './add-event.component.scss',
  providers: [UnsubscribeService],
  imports: [
    CommonModule,
    TimePickerComponent,
    InputFieldComponent,
    ModalFormComponent,
    ReactiveFormsModule,
    DatePickerComponent,
  ],
})
export class AddEventComponent implements OnInit {
  @Input() currentPage?: number;
  @Output() cancelEvent: EventEmitter<void> = new EventEmitter();

  private eventService = inject(EventsService);
  private notificationService = inject(NotificationService);
  private venueService = inject(VenuesService);
  private formatDateService = inject(FormatDateService);
  private formBuilder = inject(FormBuilder);

  public eventForm = signal<FormGroup>(this.formBuilder.group({}));
  public venues = signal<Venue[]>([]);
  public selectedDate = signal<string>('');
  public selectedTime = signal<string>('');

  constructor(@Self() private unsub: UnsubscribeService) {}

  ngOnInit(): void {
    this.loadVenues();
    this.initializeForm();
  }

  private loadVenues(): void {
    this.unsub.subs = this.venueService.getAllVenues().subscribe((venues) => {
      this.venues.set(venues);
    });
  }

  private initializeForm(): void {
    this.eventForm.set(
      this.formBuilder.group({
        eventName: ['', Validators.required],
        eventCode: ['', Validators.required],
        eventDate: ['', Validators.required],
        startTime: ['', Validators.required],
        venueID: ['', Validators.required],
      })
    );
  }

  public onSave(): void {
    this.eventForm().markAllAsTouched();

    if (this.eventForm().invalid) {
      return;
    }

    const event: Events = this.prepareEventData();
    this.addEvent(event);
  }

  private prepareEventData(): Events {
    const eventData: Events = { ...(this.eventForm().value as Events) };

    eventData.venueID = +eventData.venueID;

    const eventDate = new Date(eventData.eventDate);
    const formattedEventDate = eventDate.toISOString().split('T')[0];
    eventData.startTime = new Date(
      `${formattedEventDate} ${eventData.startTime}`
    );

    return eventData;
  }

  private addEvent(event: Events): void {
    this.unsub.subs = this.eventService.addEvents(event).subscribe({
      next: () => {
        this.eventForm().reset();
        this.selectedDate.set('');
        this.selectedTime.set('');
        this.notificationService.showSuccess(ADDED_SUCCESS);
        this.reloadEvent();
      },
      error: () => {
        this.notificationService.showError(ERROR_MESSAGE);
      },
    });
  }

  private reloadEvent(): void {
    this.unsub.subs = this.eventService
      .loadEventAndSearch(this.currentPage ?? 0)
      .subscribe();
  }
  public onDateChanged(date: Date): void {
    this.eventForm().patchValue({ eventDate: date });
    this.selectedDate.set(this.formatDateService.formatDate(date));
  }

  public onChangedTime(time: string): void {
    this.selectedTime.set(time);
    this.eventForm().patchValue({ startTime: time });
  }

  public onCancel(): void {
    this.cancelEvent.emit();
  }
}
