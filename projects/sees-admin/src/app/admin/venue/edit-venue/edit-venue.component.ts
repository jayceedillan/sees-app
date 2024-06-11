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
  InputFieldComponent,
  ModalFormComponent,
} from '../../../../../../sees-lib/src/public-api';
import { Venue } from '../venue.interface';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UnsubscribeService } from '../../../../../../../common/UnsubscribeService';
import { VenuesService } from '../service/venues.service';
import { NotificationService } from '../../../../../../../service/notification.service';
import {
  ERROR_MESSAGE,
  UPDATED_SUCESS,
} from '../../../../../../../conts/app.const';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'sees-app-edit-venue',
  standalone: true,
  templateUrl: './edit-venue.component.html',
  styleUrl: './edit-venue.component.scss',
  imports: [
    ModalFormComponent,
    InputFieldComponent,
    CommonModule,
    ReactiveFormsModule,
  ],
  providers: [UnsubscribeService],
})
export class EditVenueComponent implements OnInit {
  @Output() cancelEvent: EventEmitter<void> = new EventEmitter();
  @Output() saveEvent: EventEmitter<void> = new EventEmitter();
  @Input() venue?: Venue;
  @Input() currentPage = 0;

  private venueService = inject(VenuesService);
  private notificationService = inject(NotificationService);

  private formBuilder = inject(FormBuilder);
  public venueForm = signal<FormGroup>(this.formBuilder.group({}));

  constructor(@Self() private unsub: UnsubscribeService) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.venueForm.set(
      this.formBuilder.group({
        venueName: [this.venue?.venueName, Validators.required],
        address: [this.venue?.address, Validators.required],
      })
    );
  }

  public onSave(): void {
    this.venueForm().markAllAsTouched();

    if (this.venueForm().valid) {
      const venueData: Venue = {
        ...(this.venueForm().value as Venue),
        venueID: this.venue?.venueID ?? 0,
      };

      this.unsub.subs = this.venueService
        .updateVenue(venueData)
        .subscribe(() => {
          this.handleSuccess();
        });

      this.unsub.subs = this.venueService.updateVenue(venueData).subscribe({
        next: () => {
          this.handleSuccess();
        },
        error: () => {
          this.notificationService.showError(ERROR_MESSAGE);
        },
      });
    }
  }

  private handleSuccess(): void {
    this.notificationService.showSuccess(UPDATED_SUCESS);
    this.saveEvent.emit();
    this.onCancel();
  }

  public onCancel(): void {
    this.cancelEvent.emit();
  }
}
