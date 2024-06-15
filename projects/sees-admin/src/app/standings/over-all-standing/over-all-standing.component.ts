import { Component, OnInit, Self, inject, signal } from '@angular/core';
import { TeamOverallStandings } from '../team-standing.interface';
import { MedalColor } from '../color.enum';
import { UnsubscribeService } from '../../../../../../common/UnsubscribeService';
import { TeamStandingService } from './service/team-standing.service';
import { MedalTrophyComponent } from '../../../../../sees-lib/src/public-api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'sees-app-over-all-standing',
  standalone: true,
  templateUrl: './over-all-standing.component.html',
  styleUrl: './over-all-standing.component.scss',
  providers: [UnsubscribeService],
  imports: [MedalTrophyComponent, CommonModule],
})
export class OverAllStandingComponent implements OnInit {
  public teamOverallStandings = signal<TeamOverallStandings[]>([]);
  public medalColor = MedalColor;
  private teamStandingService = inject(TeamStandingService);

  constructor(@Self() private unsub: UnsubscribeService) {}

  ngOnInit(): void {
    this.loadOverloadStandings();
  }
  private loadOverloadStandings(): void {
    this.unsub.subs = this.teamStandingService
      .getAllOverAllStandings()
      .subscribe((teamOverallStandings) => {
        this.teamOverallStandings.set(teamOverallStandings);
      });
  }
}
