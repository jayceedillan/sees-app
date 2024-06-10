import { Component, EventEmitter, Output } from '@angular/core';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'sees-lib-confirmation-modal',
  standalone: true,
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.scss',
  imports: [ButtonComponent],
})
export class ConfirmationModalComponent {
  @Output() confirm: EventEmitter<void> = new EventEmitter<void>();
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();

  public confirmAction() {
    this.confirm.emit();
  }

  public cancelAction() {
    this.cancel.emit();
  }
}
