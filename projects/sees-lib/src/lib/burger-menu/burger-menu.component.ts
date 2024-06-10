import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'sees-lib-burger-menu',
  standalone: true,
  imports: [],
  templateUrl: './burger-menu.component.html',
  styleUrl: './burger-menu.component.scss',
})
export class BurgerMenuComponent {
  @Output() toggleSidebarEvent = new EventEmitter<void>();

  public toggleSidebar() {
    this.toggleSidebarEvent.emit();
  }
}
