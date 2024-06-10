import {
  Component,
  OnInit,
  Self,
  computed,
  inject,
  signal,
} from '@angular/core';
import { UnsubscribeService } from '../../../../../../../common/UnsubscribeService';
import {
  SearchBarButtonComponent,
  TablesComponent,
} from '../../../../../../sees-lib/src/public-api';
import { CommonModule } from '@angular/common';
import { EventsService } from '../service/events.service';
import { NotificationService } from '../../../../../../../service/notification.service';
import {
  COLUMN_NAME_EVENT,
  CURRENT_PAGE,
  DELETED_FAILED,
  DELETED_SUCESS,
} from '../../../../../../../conts/app.const';
import { Events } from '../event.interface';
import { AddEventComponent } from '../add-event/add-event.component';
import { FormatDateService } from '../../../../../../../service/format-date.service';
import { EditEventComponent } from '../edit-event/edit-event.component';

@Component({
  selector: 'sees-app-list-events',
  standalone: true,
  templateUrl: './list-events.component.html',
  styleUrl: './list-events.component.scss',
  providers: [UnsubscribeService],
  imports: [
    SearchBarButtonComponent,
    TablesComponent,
    CommonModule,
    AddEventComponent,
    EditEventComponent,
  ],
})
export class ListEventsComponent implements OnInit {
  public isAddShowModal = signal<boolean>(false);
  public currentPage = signal(CURRENT_PAGE);
  public columns = signal<string[]>(COLUMN_NAME_EVENT);
  public isEditShowModal = signal<boolean>(false);
  public selectedEvent = signal<Events>({} as Events);

  public eventsService = inject(EventsService);
  private notificationService = inject(NotificationService);
  private formatDateService = inject(FormatDateService);

  public eventsData = computed(() => {
    const events = this.eventsService.getEvents();

    const mapEvents = ((events().data ?? []) as Events[]).map((event) => ({
      ...event,
      eventDate: this.formatDateService.formatDate(new Date(event.eventDate)),
      startTime: this.formatDateService.formatTime(new Date(event.startTime)),
      venueName: event.venue.venueName,
    }));

    return {
      events: mapEvents,
      totalRowsCount: events().totalCount,
    };
  });

  constructor(@Self() private unsub: UnsubscribeService) {}

  ngOnInit(): void {
    this.onLoadAndSearch();
  }

  public onLoadAndSearch(searchQuery?: string): void {
    this.unsub.subs = this.eventsService
      .loadEventAndSearch(this.currentPage(), searchQuery)
      .subscribe();
  }

  public openModal(): void {
    this.isAddShowModal.set(!this.isAddShowModal());
  }

  public loadPerPage(currentPage: number): void {
    this.currentPage.set(currentPage);
    this.onLoadAndSearch();
  }

  public onDelete(event: { [key: string]: any }): void {
    const { eventID } = event;
    this.unsub.subs = this.eventsService.deleteEvent(eventID).subscribe({
      next: () => {
        this.loadPerPage(this.currentPage());
        this.notificationService.showSuccess(DELETED_SUCESS);
      },
      error: () => {
        this.notificationService.showError(`${DELETED_FAILED} event`);
      },
    });
  }

  public onEdit(event: { [key: string]: any }): void {
    this.isEditShowModal.set(true);
    this.selectedEvent.set(event as Events);
  }

  public onCancelEdit(): void {
    this.isEditShowModal.set(false);
  }

  public onCancel(): void {
    this.openModal();
  }
}
