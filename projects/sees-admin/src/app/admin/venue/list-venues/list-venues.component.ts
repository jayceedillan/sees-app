import {
  Component,
  OnInit,
  Self,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  SearchBarButtonComponent,
  TablesComponent,
} from '../../../../../../sees-lib/src/public-api';
import { CommonModule } from '@angular/common';
import { VenuesService } from '../service/venues.service';
import { NotificationService } from '../../../../../../../service/notification.service';
import { UnsubscribeService } from '../../../../../../../common/UnsubscribeService';
import {
  COLUMN_NAME_VENUES,
  DELETED_FAILED,
  DELETED_SUCESS,
} from '../../../../../../../conts/app.const';
import { Venue } from '../venue.interface';
import { AddVenueComponent } from '../add-venue/add-venue.component';
import { EditVenueComponent } from '../edit-venue/edit-venue.component';

@Component({
  selector: 'sees-app-list-venues',
  standalone: true,
  templateUrl: './list-venues.component.html',
  styleUrl: './list-venues.component.scss',
  providers: [UnsubscribeService],
  imports: [
    SearchBarButtonComponent,
    TablesComponent,
    CommonModule,
    AddVenueComponent,
    EditVenueComponent,
  ],
})
export class ListVenuesComponent implements OnInit {
  public isAddShowModal = signal<boolean>(false);
  public currentPage = signal<number>(1);
  public columns = signal<string[]>(COLUMN_NAME_VENUES);
  public isEditShowModal = signal<boolean>(false);
  public selectedVenue = signal<Venue>({} as Venue);

  private venueService = inject(VenuesService);
  private notificationService = inject(NotificationService);

  public VenuesData = computed(() => {
    const venues = this.venueService.getVenues();

    return {
      events: venues().data,
      totalRowsCount: venues().totalCount,
    };
  });

  constructor(@Self() private unsub: UnsubscribeService) {}

  ngOnInit(): void {
    this.onLoadAndSearch();
  }

  public onLoadAndSearch(searchQuery?: string): void {
    this.unsub.subs = this.venueService
      .loadVenuesAndSearch(this.currentPage(), searchQuery)
      .subscribe();
  }

  public openModal(): void {
    this.isAddShowModal.set(!this.isAddShowModal());
  }

  public loadPerPage(currentPage: number): void {
    this.currentPage.set(currentPage);
    this.onLoadAndSearch();
  }

  public onCancelEdit(): void {
    this.isEditShowModal.set(false);
  }

  public onSaveEdit(): void {
    this.onLoadAndSearch();
  }

  public onDelete(venue: { [key: string]: any }): void {
    const { venueID } = venue;
    this.unsub.subs = this.venueService.deleteVenue(venueID).subscribe({
      next: () => {
        this.loadPerPage(this.currentPage());
        this.notificationService.showSuccess(DELETED_SUCESS);
      },
      error: () => {
        this.notificationService.showError(`${DELETED_FAILED} venue`);
      },
    });
  }

  public onEdit(venue: { [key: string]: Venue }): void {
    this.isEditShowModal.set(true);
    this.selectedVenue.set(venue as unknown as Venue);
  }

  public onCancel(): void {
    this.openAddModal();
  }

  public openAddModal(): void {
    this.isAddShowModal.set(!this.isAddShowModal());
  }
}
