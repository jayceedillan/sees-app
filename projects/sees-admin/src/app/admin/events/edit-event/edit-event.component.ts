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
import { UPDATED_SUCESS } from '../../../../../../../conts/app.const';
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
  selector: 'sees-app-edit-event',
  standalone: true,
  templateUrl: './edit-event.component.html',
  styleUrl: './edit-event.component.scss',
  providers: [UnsubscribeService],
  imports: [
    ModalFormComponent,
    InputFieldComponent,
    DatePickerComponent,
    TimePickerComponent,
    ReactiveFormsModule,
    CommonModule,
  ],
})
export class EditEventComponent implements OnInit {
  @Input() currentPage?: number;
  @Input() event?: Events;
  @Output() cancelEvent: EventEmitter<void> = new EventEmitter();

  private eventService = inject(EventsService);
  private notificationService = inject(NotificationService);
  private venueService = inject(VenuesService);
  private formBuilder = inject(FormBuilder);

  public eventForm = signal<FormGroup>(this.formBuilder.group({}));
  public venues = signal<Venue[]>([]);
  public selectedTime = signal<string>('');

  constructor(@Self() private unsub: UnsubscribeService) {}

  ngOnInit(): void {
    this.loadVenues();
    this.initializeForm();
    this.setSelectedTime();
  }

  private setSelectedTime(): void {
    if (this.event && typeof this.event.startTime === 'string') {
      const startTimeParts = this.event.startTime.split(' ');
      if (startTimeParts.length > 0) {
        this.selectedTime.set(startTimeParts[0]);
      }
    }
  }

  private loadVenues(): void {
    this.unsub.subs = this.venueService
      .getAllVenues()
      .subscribe((venues: Venue[]) => {
        this.venues.set(venues);
      });
  }

  private initializeForm(): void {
    this.eventForm.set(
      this.formBuilder.group({
        eventCode: [this.event?.eventCode, Validators.required],
        eventName: [this.event?.eventName, Validators.required],
        eventDate: [this.event?.eventDate, Validators.required],
        startTime: [this.event?.startTime, Validators.required],
        venueID: [this.event?.venueID, Validators.required],
      })
    );
  }

  public onSave(): void {
    this.eventForm().markAllAsTouched();

    if (this.eventForm().invalid) {
      return;
    }

    const event: Events = this.prepareEventData();
    this.updateEvent(event);
  }

  private prepareEventData(): Events {
    const eventData: Events = { ...(this.eventForm().value as Events) };

    eventData.venueID = +eventData.venueID;
    eventData.eventID = this.event?.eventID ?? 0;
    const eventDate = new Date(eventData.eventDate);
    const formattedEventDate = eventDate.toDateString().split('T')[0];
    eventData.startTime = new Date(
      `${formattedEventDate} ${eventData.startTime}`
    );

    return eventData;
  }

  private updateEvent(event: Events): void {
    this.unsub.subs = this.eventService.updateEvents(event).subscribe(() => {
      this.eventForm().reset();
      this.notificationService.showSuccess(UPDATED_SUCESS);
      this.reloadEvents();
      this.onCancel();
    });
  }

  public onChangedTime(time: string): void {
    this.eventForm().patchValue({ startTime: time });
  }

  public onDateChanged(date: Date): void {
    this.eventForm().patchValue({ eventDate: date });
  }

  public onCancel(): void {
    this.cancelEvent.emit();
  }

  private reloadEvents(): void {
    this.eventService.loadEventAndSearch(this.currentPage ?? 0).subscribe();
  }
}
