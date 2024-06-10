import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'sees-lib-modal-form',
  standalone: true,
  templateUrl: './modal-form.component.html',
  styleUrl: './modal-form.component.scss',
  imports: [ButtonComponent, CommonModule],
})
export class ModalFormComponent {
  @Input() disabled?: boolean;
  @Input() title?: string;
  @Input() isShowCancel = true;
  @Input() isShowSave?: boolean = true;
  @Output() cancelEvent = new EventEmitter<void>();
  @Output() saveEvent = new EventEmitter<void>();

  public onCancel(): void {
    this.cancelEvent.emit();
  }

  public onSave(): void {
    this.saveEvent.emit();
  }
}
