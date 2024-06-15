import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OverAllStandingComponent } from '../over-all-standing/over-all-standing.component';
import { TeamStandingComponent } from '../team-standing/team-standing.component';
import { TeamScheduleComponent } from '../../team-schedule/team-schedule.component';

@Component({
  selector: 'sees-app-main-standing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './main-standing.component.html',
  styleUrl: './main-standing.component.scss',
})
export class MainStandingComponent {
  public selectedTab = signal<string>('ts');

  public tabs = signal<
    {
      id: string;
      title: string;
      component:
        | typeof OverAllStandingComponent
        | typeof TeamStandingComponent
        | typeof TeamScheduleComponent;
    }[]
  >([
    {
      id: 'oas',
      title: 'Overall Standings',
      component: OverAllStandingComponent,
    },
    {
      id: 'ts',
      title: 'Team Standings',
      component: TeamStandingComponent,
    },
    {
      id: 'tsc',
      title: 'Team Schedule',
      component: TeamScheduleComponent,
    },
  ]);

  get selectedTabTitle(): string | undefined {
    return this.tabs().find((tab) => tab.id === this.selectedTab())?.title;
  }

  selectTab(tabId: string) {
    this.selectedTab.set(tabId);
  }
}
