import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'sees-lib-button',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input() text!: string;
  @Output() clickEvent: EventEmitter<void> = new EventEmitter<void>();

  public onClick(): void {
    this.clickEvent.emit();
  }
}
