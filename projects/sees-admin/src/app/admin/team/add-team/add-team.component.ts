import { CommonModule } from '@angular/common';
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
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ColorPickerModule } from 'ngx-color-picker';
import { UnsubscribeService } from '../../../../../../../common/UnsubscribeService';
import {
  ADDED_SUCCESS,
  COLOR_WHITE,
  DEFAULT_IMAGE,
  ERROR_MESSAGE,
} from '../../../../../../../conts/app.const';
import { NotificationService } from '../../../../../../../service/notification.service';
import {
  InputFieldComponent,
  ModalFormComponent,
} from '../../../../../../sees-lib/src/public-api';
import { TeamsService } from '../service/teams.service';
import { Team } from '../team-managment.interface';

@Component({
  selector: 'sees-app-add-team',
  standalone: true,
  templateUrl: './add-team.component.html',
  styleUrl: './add-team.component.scss',
  imports: [
    ModalFormComponent,
    InputFieldComponent,
    CommonModule,
    ColorPickerModule,
    ReactiveFormsModule,
  ],
  providers: [UnsubscribeService],
})
export class AddTeamComponent {
  @Input() currentPage?: number;
  @Output() cancelEvent: EventEmitter<void> = new EventEmitter();

  public defaultImage = signal(DEFAULT_IMAGE);
  public imageUrl = signal<string | ArrayBuffer | null>(this.defaultImage());
  public color = signal<string>(COLOR_WHITE);

  private teamService = inject(TeamsService);
  private notificationService = inject(NotificationService);

  private formBuilder = inject(FormBuilder);
  public teamForm = signal<FormGroup>(
    this.formBuilder.group({
      teamName: ['', Validators.required],
      teamColor: [COLOR_WHITE, Validators.required],
    })
  );

  constructor(@Self() private unsub: UnsubscribeService) {}

  public onSave(): void {
    this.teamForm().markAllAsTouched();

    if (this.teamForm().valid) {
      const teamData: Team = {
        ...(this.teamForm().value as Team),
        logo: this.imageUrl(),
      };

      this.unsub.subs = this.teamService.addTeam(teamData).subscribe({
        next: () => {
          this.teamForm().reset();
          this.color.set(COLOR_WHITE);
          this.notificationService.showSuccess(ADDED_SUCCESS);
          this.reloadTeams();
        },
        error: () => {
          this.notificationService.showError(ERROR_MESSAGE);
        },
      });
    }
  }

  public onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.convertToBase64(file);
    }
  }

  private convertToBase64(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrl.set(reader.result);
    };
    reader.readAsDataURL(file);
  }

  private reloadTeams(): void {
    this.unsub.subs = this.teamService
      .loadTeams(this.currentPage ?? 0)
      .subscribe();
  }

  public onCancel(): void {
    this.cancelEvent.emit();
  }

  public onColorChange(color: string) {
    this.color.set(color);

    this.teamForm().setValue({
      ...this.teamForm().value,
      teamColor: color,
    });
  }
}
