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
  COLUMN_NAME_TEAM,
  CURRENT_PAGE,
  DELETED_FAILED,
  DELETED_SUCESS,
} from '../../../../../../../conts/app.const';
import { NotificationService } from '../../../../../../../service/notification.service';
import {
  SearchBarButtonComponent,
  TablesComponent,
} from '../../../../../../sees-lib/src/public-api';
import { TeamsService } from '../service/teams.service';
import { Team } from '../team-managment.interface';

@Component({
  selector: 'sees-app-list-teams',
  standalone: true,
  templateUrl: './list-teams.component.html',
  styleUrl: './list-teams.component.scss',
  imports: [SearchBarButtonComponent, TablesComponent, CommonModule],
  providers: [UnsubscribeService],
})
export class ListTeamsComponent implements OnInit {
  public isAddShowModal = signal<boolean>(false);
  public currentPage = signal(CURRENT_PAGE);
  public columns = signal<string[]>(COLUMN_NAME_TEAM);
  public isEditShowModal = signal<boolean>(false);
  public selectedTeam = signal<Team>({} as Team);

  private teamService = inject(TeamsService);
  private notificationService = inject(NotificationService);

  constructor(@Self() private unsub: UnsubscribeService) {}

  public teamData = computed(() => {
    const teamsSignal = this.teamService.getTeams();

    return {
      players: teamsSignal().data,
      totalRowsCount: teamsSignal().totalCount,
    };
  });

  ngOnInit(): void {
    this.onLoadAndSearch();
  }

  public onLoadAndSearch(searchQuery?: string): void {
    this.unsub.subs = this.teamService
      .loadTeamAndSearch(this.currentPage(), searchQuery)
      .subscribe();
  }

  public openModal(): void {
    this.isAddShowModal.set(!this.isAddShowModal());
  }

  public onDelete(team: { [key: string]: any }): void {
    const { teamID } = team;
    this.unsub.subs = this.teamService.deleteTeam(teamID).subscribe({
      next: () => {
        this.loadPerPage(this.currentPage());
        this.notificationService.showSuccess(DELETED_SUCESS);
      },
      error: () => {
        this.notificationService.showError(`${DELETED_FAILED} Team`);
      },
    });
  }

  public onEdit(team: { [key: string]: any }): void {
    this.isEditShowModal.set(true);
    this.selectedTeam.set(team as Team);
  }
  public loadPerPage(currentPage: number): void {
    this.currentPage.set(currentPage);
    this.onLoadAndSearch();
  }
}
