import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'sees-lib-time-picker',
  standalone: true,
  templateUrl: './time-picker.component.html',
  styleUrl: './time-picker.component.scss',
  imports: [ReactiveFormsModule, FormsModule, CommonModule, ButtonComponent],
})
export class TimePickerComponent {
  @Input() isClearTime?: boolean;
  @Input() id?: string;
  @Input() selectedTime?: string;
  @Output() TimeChangedValue = new EventEmitter<string>();

  public tempTime = signal<string>('');
  public isPopupOpen = signal<boolean>(false);

  public onTimeInputChange(): void {
    this.TimeChangedValue.emit(this.tempTime() || '');
  }

  public openPopup(): void {
    this.tempTime.set(this.selectedTime || '');
    this.isPopupOpen.set(true);
  }

  public closePopup(): void {
    this.isPopupOpen.set(false);
  }

  public onClear(): void {
    this.selectedTime = '';
  }

  public onOk(): void {
    this.selectedTime = this.tempTime();
    this.closePopup();
  }

  public onCancel(): void {
    this.tempTime.set('');
    this.closePopup();
  }
}
