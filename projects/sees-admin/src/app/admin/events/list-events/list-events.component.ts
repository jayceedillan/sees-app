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

  public eventsData = computed(() => {
    const events = this.eventsService.getEvents();

    return {
      players: events().data,
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

  public onCancel(): void {
    this.openModal();
  }
}
