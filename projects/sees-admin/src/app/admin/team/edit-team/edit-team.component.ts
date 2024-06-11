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
import { ColorPickerModule } from 'ngx-color-picker';
import { UnsubscribeService } from '../../../../../../../common/UnsubscribeService';
import {
  COLOR_WHITE,
  DEFAULT_IMAGE,
  UPDATED_SUCESS,
} from '../../../../../../../conts/app.const';
import { NotificationService } from '../../../../../../../service/notification.service';
import {
  InputFieldComponent,
  ModalFormComponent,
} from '../../../../../../sees-lib/src/public-api';
import { TeamsService } from '../service/teams.service';
import { Team } from '../team-managment.interface';

@Component({
  selector: 'sees-app-edit-team',
  standalone: true,
  templateUrl: './edit-team.component.html',
  styleUrl: './edit-team.component.scss',
  providers: [UnsubscribeService],
  imports: [
    ModalFormComponent,
    CommonModule,
    ColorPickerModule,
    ReactiveFormsModule,
    InputFieldComponent,
  ],
})
export class EditTeamComponent implements OnInit {
  @Output() cancelEvent: EventEmitter<void> = new EventEmitter();
  @Output() saveEvent: EventEmitter<void> = new EventEmitter();
  @Input() team?: Team;
  @Input() currentPage = 0;

  public defaultImage = signal(DEFAULT_IMAGE);
  public imageUrl = signal<string | ArrayBuffer | null>(this.defaultImage());
  public color = signal<string>(COLOR_WHITE);

  private formBuilder = inject(FormBuilder);
  private teamService = inject(TeamsService);
  private notificationService = inject(NotificationService);

  public teamForm = signal<FormGroup>(this.formBuilder.group({}));

  constructor(@Self() private unsub: UnsubscribeService) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    const { teamName, teamColor } = this.team ?? {};
    this.teamForm.set(
      this.formBuilder.group({
        teamName: [teamName, Validators.required],
        teamColor: [teamColor, Validators.required],
      })
    );

    this.color.set((teamColor ?? DEFAULT_COLOR) as string);
    this.imageUrl.set(this.team?.logo ?? this.defaultImage());
  }

  public onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file: File | undefined = input.files?.[0];
    if (file) {
      this.convertToBase64(file);
    }
  }

  private convertToBase64(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrl.set(reader.result);
      if (this.team) {
        this.team.logo = this.imageUrl();
      }
    };
    reader.readAsDataURL(file);
  }

  public onSave(): void {
    this.teamForm().markAllAsTouched();

    if (this.teamForm().valid) {
      const { teamName, teamColor } = this.teamForm().value;
      const teamID = this.team?.teamID ?? 0;
      this.team = { teamName, teamColor, logo: this.imageUrl(), teamID };

      this.unsub.subs = this.teamService.updateTeam(this.team).subscribe(() => {
        this.notificationService.showSuccess(UPDATED_SUCESS);
        this.saveEvent.emit();
        this.onCancel();
      });
    }
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

  public clear(): void {
    this.imageUrl.set(DEFAULT_IMAGE);
    if (this.team) {
      this.team.logo = null;
    }
  }
}
function DEFAULT_COLOR(value: string): void {
  throw new Error('Function not implemented.');
}
