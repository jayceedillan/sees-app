import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
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
  ERROR_MESSAGE,
  UPDATED_SUCESS,
} from '../../../../../../../conts/app.const';
import { NotificationService } from '../../../../../../../service/notification.service';
import {
  InputFieldComponent,
  ModalFormComponent,
} from '../../../../../../sees-lib/src/public-api';
import { SportsService } from '../service/sports.service';
import { Sport } from '../sport.interace';

@Component({
  selector: 'sees-app-edit-sports',
  standalone: true,
  imports: [
    ModalFormComponent,
    InputFieldComponent,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './edit-sports.component.html',
  styleUrl: './edit-sports.component.scss',
  providers: [UnsubscribeService],
})
export class EditSportsComponent implements OnInit {
  @Input() sport?: Sport;
  @Input() currentPage = 0;
  @Output() cancelEvent: EventEmitter<void> = new EventEmitter();

  private sportsService = inject(SportsService);
  private notificationService = inject(NotificationService);
  private formBuilder = inject(FormBuilder);
  public sportForm = signal<FormGroup>(this.formBuilder.group({}));

  constructor(@Self() private unsub: UnsubscribeService) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.sportForm.set(
      this.formBuilder.group({
        sportName: [this.sport?.sportName, Validators.required],
      })
    );
  }

  public onSave(): void {
    this.sportForm().markAllAsTouched();
    if (this.sportForm().valid) {
      const sport = {
        sportName: this.sportForm().get('sportName')?.value,
        sportID: this.sport?.sportID ?? 0,
      };

      this.unsub.subs = this.sportsService.updateSport(sport).subscribe({
        next: () => {
          this.notificationService.showSuccess(UPDATED_SUCESS);
          this.unsub.subs = this.sportsService
            .loadSportAndSearch(1)
            .subscribe();
        },
        error: () => {
          this.notificationService.showError(ERROR_MESSAGE);
        },
      });
    }
  }

  public onCancel(): void {
    this.cancelEvent.emit();
  }
}
