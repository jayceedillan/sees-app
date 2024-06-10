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
      name: 'Menu Item 1',
      children: [{ name: 'Submenu Item 1' }, { name: 'Submenu Item 2' }],
    },
    { name: 'Menu Item 2' },
    { name: 'Menu Item 3' },
  ];

  players = [
    {
      name: 'Jessie',
      middleInitial: 'P.',
      lastName: 'Furigay',
      birthday: '11/16/1977',
      contactNo: '123-456-7890',
      email: 'jessie@example.com',
      age: 46,
      gender: 'Male',
      height: '6ft',
      weight: '180lbs',
      teamName: 'Team A',
      level: 'Pro',
    },
    // Add more player objects here
  ];
}
