import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'sees-lib-input-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './input-field.component.html',
  styleUrl: './input-field.component.scss',
})
export class InputFieldComponent {
  @Input() label?: string;
  @Input() controlName = '';
  @Input() control?: FormControl;
  @Input() type = 'text';
}
