import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
  selectedTab: string = 'oas';

  tabs = [
    {
      id: 'oas',
      title: 'Over all Standings',
      component: OverAllStandingComponent,
    },
    {
      id: 'ts',
      title: 'Team Standings',
      component: TeamStandingComponent,
    },
    { id: 'tsc', title: 'Team Schedule', component: TeamScheduleComponent },
  ];

  menuItems = [
    { link: 'demo1.html', title: '1. Responsive Tabs' },
    { link: 'demo2.html', title: '2. Multiple' },
    { link: 'demo3.html', title: '3. Ajax Tabs' },
    { link: 'demo4.html', title: '4. Dynamic', active: true },
  ];

  get selectedTabTitle(): string | undefined {
    return this.tabs.find((tab) => tab.id === this.selectedTab)?.title;
  }

  selectTab(tabId: string) {
    this.selectedTab = tabId;
  }
}
