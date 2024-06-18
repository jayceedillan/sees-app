import {
  Component,
  OnInit,
  Self,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FilterSelectionComponent } from '../../shared/filter-selection/filter-selection.component';
import { UnsubscribeService } from '../../../../../../common/UnsubscribeService';
import { TeamStandingService } from '../over-all-standing/service/team-standing.service';
import { HtmlStyleService } from '../../../../../../service/html-style.service';
import { map, take } from 'rxjs';
import { TeamStanding } from '../team-standing.interface';
import { orderBy } from 'lodash';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'sees-app-team-standing',
  standalone: true,
  templateUrl: './team-standing.component.html',
  styleUrl: './team-standing.component.scss',
  imports: [FilterSelectionComponent, CommonModule],
  providers: [UnsubscribeService],
})
export class TeamStandingComponent {
  public selectedEventID = signal<number>(0);
  public selectedSportID = signal<number>(0);
  public teamStandings = signal<TeamStanding[]>([]);
  public hasValueScore = signal<boolean>(false);

  private teamStandingService = inject(TeamStandingService);
  public htmlStyleService = inject(HtmlStyleService);

  constructor(@Self() private unsub: UnsubscribeService) {}

  public eventsData = computed(() => {
    alert(this.selectedEventID());
    alert(this.selectedSportID());
  });

  public onSelectedChangedEvent(id: number): void {
    this.selectedEventID.set(id);
    this.getTeamStandingBySportIdAndEventId();
  }

  public onSelectedChangedSport(id: number): void {
    this.selectedSportID.set(id);
    this.getTeamStandingBySportIdAndEventId();
  }

  private getTeamStandingBySportIdAndEventId(): void {
    if (this.selectedEventID && this.selectedSportID) {
      this.unsub.subs = this.teamStandingService
        .getTeamStandingBySportAndEvents(
          this.selectedSportID(),
          this.selectedEventID()
        )
        .pipe(
          take(1),
          map((teamStanding: TeamStanding[]) => {
            return this.teamStandings().map((standingFromTeamStandings) => {
              const matchingTeamStanding = teamStanding.find(
                (standing) =>
                  standing.team.teamID === standingFromTeamStandings.team.teamID
              );
              if (matchingTeamStanding) {
                standingFromTeamStandings.losses = matchingTeamStanding.losses;
                standingFromTeamStandings.wins = matchingTeamStanding.wins;
              } else {
                standingFromTeamStandings.losses = 0;
                standingFromTeamStandings.wins = 0;
              }
              return standingFromTeamStandings;
            });
          })
        )
        .subscribe((updatedStandings: TeamStanding[]) => {
          const sortedStandings = orderBy(updatedStandings, ['wins'], ['desc']);
          this.teamStandings.set(sortedStandings);
          this.hasAnyTeamValue();
        });
    }
  }

  private hasAnyTeamValue(): void {
    this.hasValueScore.set(
      this.teamStandings().some((team) => team.wins > 0 || team.losses > 0)
    );
  }
}
