import { Component, OnInit } from '@angular/core';
import { FilterSelectionComponent } from '../../shared/filter-selection/filter-selection.component';

@Component({
  selector: 'sees-app-team-standing',
  standalone: true,
  templateUrl: './team-standing.component.html',
  styleUrl: './team-standing.component.scss',
  imports: [FilterSelectionComponent],
})
export class TeamStandingComponent implements OnInit {
  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    console.log('xx');
  }
}
