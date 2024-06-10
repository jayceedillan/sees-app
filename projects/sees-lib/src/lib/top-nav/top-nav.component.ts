import { Component, EventEmitter, Output } from '@angular/core';
import { BurgerMenuComponent } from '../burger-menu/burger-menu.component';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'sees-lib-top-nav',
  standalone: true,
  templateUrl: './top-nav.component.html',
  styleUrl: './top-nav.component.scss',
  imports: [BurgerMenuComponent, ButtonComponent],
})
export class TopNavComponent {
  @Output() toggleSidebarEvent = new EventEmitter<void>();

  public logout() {
    console.log('Logout button clicked');
    // Implement your logout logic here
  }

  public toggleSidebar() {
    this.toggleSidebarEvent.emit();
  }
}
