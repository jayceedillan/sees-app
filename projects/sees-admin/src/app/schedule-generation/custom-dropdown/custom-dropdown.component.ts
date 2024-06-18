import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'sees-app-custom-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-dropdown.component.html',
  styleUrl: './custom-dropdown.component.scss',
})
export class CustomDropdownComponent {
  @Input() options: string[] = [];
  selectedOption: string | undefined;
  showDropdown = false;

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  selectOption(option: string): void {
    this.selectedOption = option;
    this.showDropdown = false; // Hide dropdown after selection
  }
}
