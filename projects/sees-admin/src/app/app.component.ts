import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BurgerMenuComponent } from '../../../sees-lib/src/lib/burger-menu/burger-menu.component';
import { TopNavComponent } from '../../../sees-lib/src/lib/top-nav/top-nav.component';
import { SideBarComponent } from '../../../sees-lib/src/lib/side-bar/side-bar.component';
import { FooterComponent } from '../../../sees-lib/src/lib/footer/footer.component';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../../../sees-lib/src/lib/pagination/pagination.component';
import { TablesComponent } from '../../../sees-lib/src/lib/tables/tables.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    RouterOutlet,
    BurgerMenuComponent,
    TopNavComponent,
    SideBarComponent,
    FooterComponent,
    CommonModule,
    PaginationComponent,
    TablesComponent,
  ],
})
export class AppComponent {
  title = 'Sport Events Scheduling System';

  public menu = [
    {
      name: 'Management',
      children: [
        { name: 'Event', link: 'admin/list-events' },
        { name: 'Venue', link: 'admin/list-venues' },
        { name: 'Sport', link: 'admin/list-sports' },
        { name: 'Team', link: 'admin/list-teams' },
        { name: 'Player', link: 'admin/list-players' },
      ],
    },
    { name: 'Over All Standing', link: 'standing' },
    { name: 'Schedule Generation', link: 'schedule/generation' },
    { name: 'Tabulator' },
  ];
}
