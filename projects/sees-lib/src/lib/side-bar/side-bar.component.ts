import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'sees-lib-side-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss',
})
export class SideBarComponent {
  @Input() menu: any[] = [];

  public isSidebarOpen = false;

  public toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
