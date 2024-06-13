import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NamedValue } from './namedValue.interface';

@Component({
  selector: 'sees-lib-drop-down-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './drop-down-list.component.html',
  styleUrl: './drop-down-list.component.scss',
})
export class DropDownListComponent {
  @Input() dataItems: NamedValue[] = [];
  @Input() control?: FormControl;
  @Input() label?: string;
  @Input() selectionValue?: number;
  @Output() selectionChangedValue = new EventEmitter<number>();

  public onSelectionChange(): void {
    this.selectionChangedValue.emit(Number(this.selectionValue));
  }

  public clearSelection() {
    this.selectionValue = undefined;
  }
}
