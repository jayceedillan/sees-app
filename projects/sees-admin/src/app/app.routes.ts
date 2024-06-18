import { Routes } from '@angular/router';
import { ListEventsComponent } from './admin/events/list-events/list-events.component';
import { ListSportsComponent } from './admin/sports/list-sports/list-sports.component';
import { ListTeamsComponent } from './admin/team/list-teams/list-teams.component';
import { ListUsersComponent } from './admin/user/list-users/list-users.component';
import { ListVenuesComponent } from './admin/venue/list-venues/list-venues.component';
import { ListPlayersComponent } from './admin/players/list-players/list-players.component';
import { MainStandingComponent } from './standings/main-standing/main-standing.component';
import { ScheduleGenerationComponent } from './schedule-generation/schedule-generation.component';

export const routes: Routes = [
  {
    path: 'admin/list-players',
    component: ListPlayersComponent,
  },
  {
    path: 'admin/list-sports',
    component: ListSportsComponent,
  },
  {
    path: 'admin/list-teams',
    component: ListTeamsComponent,
  },
  {
    path: 'admin/list-users',
    component: ListUsersComponent,
  },
  {
    path: 'admin/list-venues',
    component: ListVenuesComponent,
  },
  {
    path: 'admin/list-events',
    component: ListEventsComponent,
  },
  {
    path: 'standing',
    component: MainStandingComponent,
  },
  {
    path: 'schedule/generation',
    component: ScheduleGenerationComponent,
  },
];

//https://www.youtube.com/watch?v=nXJFhZdbWzw
//https://www.youtube.com/watch?v=xS1bpSnNv_U
