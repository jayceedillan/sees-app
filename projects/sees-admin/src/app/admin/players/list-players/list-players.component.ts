import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  Self,
  computed,
  inject,
  signal,
} from '@angular/core';
import { format, parseISO } from 'date-fns';
import * as mapLodash from 'lodash';
import { UnsubscribeService } from '../../../../../../../common/UnsubscribeService';
import {
  COLUMN_NAMES_PLAYER,
  CURRENT_PAGE,
  DELETED_FAILED,
  DELETED_SUCESS,
  FORMAT_DATE,
} from '../../../../../../../conts/app.const';
import { NotificationService } from '../../../../../../../service/notification.service';
import { SearchBarButtonComponent } from '../../../../../../sees-lib/src/lib/search-bar-button/search-bar-button.component';

import { ResponseData } from '../../Response.interface';
import { PlayerSport, Players } from '../players.interface';
import { PlayersService } from '../service/players.service';

import {
  ModalFormComponent,
  TablesComponent,
} from '../../../../../../sees-lib/src/public-api';
import { AddPlayersComponent } from '../add-players/add-players.component';
import { EditPlayersComponent } from '../edit-players/edit-players.component';
import { User } from '../../user/user.interface';

@Component({
  selector: 'sees-app-list-players',
  standalone: true,
  templateUrl: './list-players.component.html',
  styleUrl: './list-players.component.scss',
  providers: [UnsubscribeService],
  imports: [
    TablesComponent,
    CommonModule,
    SearchBarButtonComponent,
    ModalFormComponent,
    AddPlayersComponent,
    EditPlayersComponent,
  ],
})
export class ListPlayersComponent implements OnInit {
  playersService = inject(PlayersService);
  notificationService = inject(NotificationService);

  public isShowModal = signal(false);
  public isEditShowModal = signal(false);
  public currentPage = signal(CURRENT_PAGE);
  public columns = signal(COLUMN_NAMES_PLAYER);
  public selectedPlayer = signal<Players>({} as Players);

  public playersData = computed(() => {
    const playersSignal = this.playersService.getPlayers();
    const playersData: ResponseData<Players[]> = playersSignal();
    const players = playersData.data;
    const totalRowsCount = playersData.totalCount;

    return {
      players: this.formatPlayerAttributes(players),
      totalRowsCount: totalRowsCount,
    };
  });

  constructor(@Self() private unsub: UnsubscribeService) {}

  ngOnInit(): void {
    this.onLoadAndSearch();
  }

  private formatPlayerAttributes(players: Players[]): Players[] {
    players.forEach((player) => {
      player.sports = this.getSportNames(player.playerSports);
      player.teamName = player.team?.teamName ?? '';
      player.level = player.educationalLevel?.educationalLevelName ?? '';
      player.age = this.playersService.onDateChanged(
        new Date(player.dateOfBirth)
      );
      player.birthDate = format(
        parseISO(player.dateOfBirth.toString()),
        FORMAT_DATE
      );
    });

    return players;
  }

  public onLoadAndSearch(searchQuery?: string): void {
    this.unsub.subs = this.playersService
      .loadPlayersAndSearch(this.currentPage(), searchQuery)
      .subscribe();
  }

  public getSportNames(playerSport: PlayerSport[] | undefined): string[] {
    return mapLodash.map(playerSport, 'sport.sportName');
  }

  public loadPerPage(currentPage: number): void {
    this.currentPage.set(currentPage);
    this.onLoadAndSearch();
  }

  public onDelete(player: { [key: string]: any }): void {
    this.unsub.subs = this.playersService
      .deletePlayer(player['playerID'])
      .subscribe({
        next: () => {
          this.loadPerPage(this.currentPage());
          this.notificationService.showSuccess(DELETED_SUCESS);
        },
        error: () => {
          this.notificationService.showError(`${DELETED_FAILED} player`);
        },
      });
  }

  public onEdit(player: { [key: string]: any }): void {
    this.isEditShowModal.set(true);
    this.selectedPlayer.set(player as Players);
  }

  public onCancel(): void {
    this.openModal();
  }

  public openModal(): void {
    this.isShowModal.set(!this.isShowModal());
  }

  public onCancelEdit(): void {
    this.isEditShowModal.set(false);
  }
}
