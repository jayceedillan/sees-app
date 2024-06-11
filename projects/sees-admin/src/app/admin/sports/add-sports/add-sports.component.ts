import {
  Component,
  EventEmitter,
  Output,
  Self,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UnsubscribeService } from '../../../../../../../common/UnsubscribeService';
import {
  ADDED_SUCCESS,
  ERROR_MESSAGE,
} from '../../../../../../../conts/app.const';
import { NotificationService } from '../../../../../../../service/notification.service';
import {
  InputFieldComponent,
  ModalFormComponent,
} from '../../../../../../sees-lib/src/public-api';
import { SportsService } from '../service/sports.service';
import { CommonModule } from '@angular/common';
import { Sport } from '../sport.interace';

@Component({
  selector: 'sees-app-add-sports',
  standalone: true,
  templateUrl: './add-sports.component.html',
  styleUrl: './add-sports.component.scss',
  providers: [UnsubscribeService],
  imports: [
    ModalFormComponent,
    InputFieldComponent,
    CommonModule,
    ReactiveFormsModule,
  ],
})
export class AddSportsComponent {
  @Output() cancelEvent: EventEmitter<void> = new EventEmitter();

  private sportsService = inject(SportsService);
  private notificationService = inject(NotificationService);

  private formBuilder = inject(FormBuilder);
  public sportForm = signal<FormGroup>(
    this.formBuilder.group({ sportName: ['', Validators.required] })
  );

  constructor(@Self() private unsub: UnsubscribeService) {}

  public onSave(): void {
    this.sportForm().markAllAsTouched();

    if (this.sportForm().valid) {
      const sportData: Sport = { ...(this.sportForm().value as Sport) };

      this.unsub.subs = this.sportsService.addTeam(sportData).subscribe({
        next: () => {
          this.sportForm().reset();
          this.notificationService.showSuccess(ADDED_SUCCESS);
          this.reloadSports();
        },
        error: () => {
          this.notificationService.showError(ERROR_MESSAGE);
        },
      });
    }
  }

  private reloadSports(): void {
    this.unsub.subs = this.sportsService.loadSportAndSearch(1).subscribe();
  }

  public onCancel(): void {
    this.cancelEvent.emit();
  }
}
