import { CommonModule } from '@angular/common';
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
  CURRENT_PAGE,
  DELETED_FAILED,
  DELETED_SUCESS,
} from '../../../../../../../conts/app.const';
import { NotificationService } from '../../../../../../../service/notification.service';
import {
  SearchBarButtonComponent,
  TablesComponent,
} from '../../../../../../sees-lib/src/public-api';
import { AddSportsComponent } from '../add-sports/add-sports.component';
import { SportsService } from '../service/sports.service';
import { Sport } from '../sport.interace';

@Component({
  selector: 'sees-app-list-sports',
  standalone: true,
  templateUrl: './list-sports.component.html',
  styleUrl: './list-sports.component.scss',
  providers: [UnsubscribeService],
  imports: [
    SearchBarButtonComponent,
    TablesComponent,
    AddSportsComponent,
    CommonModule,
  ],
})
export class ListSportsComponent implements OnInit {
  public sportsService = inject(SportsService);
  private notificationService = inject(NotificationService);

  public currentPage = signal(CURRENT_PAGE);
  public columns = signal<string[]>(['sportName']);
  public isAddShowModal = signal<boolean>(false);
  public isEditShowModal = signal<boolean>(false);
  public selectedSport = signal<Sport>({} as Sport);

  public sportData = computed(() => {
    const sportsSignal = this.sportsService.getSports();

    return {
      players: sportsSignal().data,
      totalRowsCount: sportsSignal().totalCount,
    };
  });

  constructor(@Self() private unsub: UnsubscribeService) {}

  ngOnInit(): void {
    this.onLoadAndSearch();
  }

  public onLoadAndSearch(searchQuery?: string): void {
    this.unsub.subs = this.sportsService
      .loadSportAndSearch(this.currentPage(), searchQuery)
      .subscribe();
  }

  public openModal(): void {
    this.isAddShowModal.set(!this.isAddShowModal());
  }

  public onCancel(): void {
    this.openModal();
  }

  public onDelete(sport: { [key: string]: any }): void {
    debugger;
    const { sportID } = sport;

    this.unsub.subs = this.sportsService.deleteSport(sportID).subscribe({
      next: () => {
        this.loadPerPage(this.currentPage());
        this.notificationService.showSuccess(DELETED_SUCESS);
      },
      error: () => {
        this.notificationService.showError(`${DELETED_FAILED} sport`);
      },
    });
  }

  public onEdit(sport: { [key: string]: any }): void {
    this.isEditShowModal.set(true);
    this.selectedSport.set(sport as Sport);
  }

  public onCancelEdit(): void {
    this.isEditShowModal.set(false);
  }

  public loadPerPage(currentPage: number): void {
    this.currentPage.set(currentPage);
    this.onLoadAndSearch();
  }
}
