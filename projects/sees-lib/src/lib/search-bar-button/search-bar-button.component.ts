import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'sees-lib-search-bar-button',
  standalone: true,
  templateUrl: './search-bar-button.component.html',
  styleUrl: './search-bar-button.component.scss',
  imports: [ButtonComponent, FormsModule],
})
export class SearchBarButtonComponent {
  @Input() buttonText: string = '';
  @Input() placeHolder: string = '';
  @Output() openModalEvent: EventEmitter<void> = new EventEmitter();
  @Output() searchEvent: EventEmitter<string> = new EventEmitter();

  public searchQuery: string = '';

  public onOpenModal(): void {
    this.openModalEvent.emit();
  }

  public onSearch() {
    this.searchEvent.emit(this.searchQuery);
  }
}
