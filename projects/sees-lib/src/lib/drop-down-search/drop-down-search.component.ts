import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NamedValue } from '../drop-down-list/namedValue.interface';

@Component({
  selector: 'sees-lib-drop-down-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './drop-down-search.component.html',
  styleUrl: './drop-down-search.component.scss',
})
export class DropDownSearchComponent implements OnInit {
  @Input() dropDownItems?: NamedValue[];
  @Input() selectionText?: string;

  @Output() selectionChangedValue = new EventEmitter<NamedValue>();

  public filteredOptions = signal<NamedValue[]>([]);
  public searchTerm = signal<string>('');
  public selectedOption = signal<NamedValue>({} as NamedValue);
  public isOpen = signal<boolean>(false);

  ngOnInit(): void {
    this.initializeFilteredOptions();
  }

  private initializeFilteredOptions(): void {
    this.filteredOptions.set(this.dropDownItems ?? []);
  }

  public filterOptions(): void {
    const searchTermLower = this.searchTerm().toLowerCase();
    this.filteredOptions.set(
      this.dropDownItems?.filter((option) =>
        option.name.toLowerCase().includes(searchTermLower)
      ) || []
    );
  }

  public toggleDropdown(): void {
    this.isOpen.set(!this.isOpen());
    if (!this.isOpen()) {
      this.resetSearch();
    }
  }

  public selectOption(selectedData: NamedValue): void {
    this.selectedOption.set(selectedData);
    this.closeDropdownAndReset();
    this.selectionChangedValue.emit(selectedData);
  }

  private resetSearch(): void {
    this.searchTerm.set('');
    this.filteredOptions.set(this.dropDownItems || []);
  }

  private closeDropdownAndReset(): void {
    this.isOpen.set(false);
    this.resetSearch();
  }
}
