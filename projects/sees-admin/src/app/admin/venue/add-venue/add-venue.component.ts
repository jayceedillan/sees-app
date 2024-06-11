import {
  Component,
  EventEmitter,
  Input,
  Output,
  Self,
  inject,
  signal,
} from '@angular/core';
import {
  InputFieldComponent,
  ModalFormComponent,
} from '../../../../../../sees-lib/src/public-api';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { VenuesService } from '../service/venues.service';
import { NotificationService } from '../../../../../../../service/notification.service';
import { Venue } from '../venue.interface';
import { UnsubscribeService } from '../../../../../../../common/UnsubscribeService';
import {
  ADDED_SUCCESS,
  ERROR_MESSAGE,
} from '../../../../../../../conts/app.const';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'sees-app-add-venue',
  standalone: true,
  templateUrl: './add-venue.component.html',
  styleUrl: './add-venue.component.scss',
  imports: [
    ModalFormComponent,
    InputFieldComponent,
    CommonModule,
    ReactiveFormsModule,
  ],
  providers: [UnsubscribeService],
})
export class AddVenueComponent {
  @Input() currentPage?: number;
  @Output() cancelEvent: EventEmitter<void> = new EventEmitter();

  private venueService = inject(VenuesService);
  private notificationService = inject(NotificationService);

  private formBuilder = inject(FormBuilder);
  public venueForm = signal<FormGroup>(
    this.formBuilder.group({
      venueName: ['', Validators.required],
      address: ['', Validators.required],
    })
  );

  constructor(@Self() private unsub: UnsubscribeService) {}

  public onSave(): void {
    this.venueForm().markAllAsTouched();

    if (this.venueForm().valid) {
      const venueData: Venue = { ...(this.venueForm().value as Venue) };

      this.unsub.subs = this.venueService.addVenue(venueData).subscribe({
        next: () => {
          this.venueForm().reset();
          this.notificationService.showSuccess(ADDED_SUCCESS);
          this.reloadVenue();
        },
        error: () => {
          this.notificationService.showError(ERROR_MESSAGE);
        },
      });
    }
  }

  private reloadVenue(): void {
    this.unsub.subs = this.venueService
      .loadVenues(this.currentPage ?? 0)
      .subscribe();
  }
  public onCancel(): void {
    this.cancelEvent.emit();
  }
}
