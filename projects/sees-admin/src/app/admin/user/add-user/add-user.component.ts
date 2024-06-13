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
import { ModalFormComponent } from '../../../../../../sees-lib/src/lib/modal-form/modal-form.component';
import { InputFieldComponent } from '../../../../../../sees-lib/src/lib/input-field/input-field.component';
import { DropDownListComponent } from '../../../../../../sees-lib/src/lib/drop-down-list/drop-down-list.component';
import { NamedValue } from '../../namedValue.interface';
import { UnsubscribeService } from '../../../../../../../common/UnsubscribeService';
import { UsersService } from '../service/users.service';
import { PlayersService } from '../../players/service/players.service';
import { NotificationService } from '../../../../../../../service/notification.service';
import { TeamsService } from '../../team/service/teams.service';
import { combineLatest, map } from 'rxjs';
import {
  FormBuilder,
  FormControl,
  FormControlOptions,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EducationalLevel } from '../../players/players.interface';
import { Role, User } from '../user.interface';
import {
  ADDED_SUCCESS,
  ERROR_MESSAGE,
  GENDER,
} from '../../../../../../../conts/app.const';
import { PasswordValidatorService } from '../service/password-validator.service';

@Component({
  selector: 'sees-app-add-user',
  standalone: true,
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss',
  imports: [
    ModalFormComponent,
    InputFieldComponent,
    DropDownListComponent,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [UnsubscribeService],
})
export class AddUserComponent implements OnInit {
  @Input() currentPage?: number;
  @Output() cancelEvent: EventEmitter<void> = new EventEmitter();

  public designations = signal<NamedValue[]>([]);
  public teams = signal<NamedValue[]>([]);
  public educationLevels = signal<EducationalLevel[]>([]);
  public roles = signal<Role[]>([]);
  public isShowTeam = signal<boolean>(false);
  public genders = signal<string[]>(GENDER);

  private usersService = inject(UsersService);
  private playersService = inject(PlayersService);
  private notificationService = inject(NotificationService);
  private teamService = inject(TeamsService);
  private passwordValidatorService = inject(PasswordValidatorService);
  private formBuilder = inject(FormBuilder);
  public userForm = signal<FormGroup>(this.formBuilder.group({}));

  constructor(@Self() private unsub: UnsubscribeService) {}

  ngOnInit(): void {
    this.loadData();
    this.initializeForm();
  }
  private loadData(): void {
    this.unsub.subs = combineLatest([
      this.playersService.loadEducationalLevel(),
      this.usersService.getDesignation().pipe(
        map((designations) =>
          designations.map((designation) => ({
            name: designation.designationName,
            value: designation.designationID,
          }))
        )
      ),
      this.usersService.getRoles(),
      this.teamService
        .getAllTeams()
        .pipe(
          map((teams) =>
            teams.map((team) => ({ name: team.teamName, value: team.teamID }))
          )
        ),
    ]).subscribe(([educationLevels, designations, roles, teams]) => {
      this.educationLevels.set(educationLevels);
      this.designations.set(designations);
      this.roles.set(roles);
      this.teams.set(teams);
    });
  }

  private initializeForm(): void {
    this.userForm.set(
      this.formBuilder.group(
        {
          firstName: new FormControl('', [Validators.required]),
          middleName: new FormControl('', [Validators.required]),
          lastName: new FormControl('', [Validators.required]),
          emailAddress: new FormControl('', [
            Validators.required,
            Validators.email,
          ]),
          contactNo: new FormControl(''),
          gender: new FormControl('Male'),
          userName: new FormControl('', [Validators.required]),
          educationalLevelID: new FormControl(1, [Validators.required]),
          designationID: new FormControl<number>(0, [Validators.required]),
          roleID: new FormControl(1, [Validators.required]),
          password: new FormControl('', [
            Validators.required,
            Validators.minLength(6),
            this.passwordValidatorService.strongPasswordValidator(),
          ]),
          confirmPassword: new FormControl('', [Validators.required]),
        },
        {
          validator: this.matchingInputsValidator(
            'password',
            'confirmPassword'
          ),
        } as FormControlOptions
      )
    );
  }

  private matchingInputsValidator(
    firstKey: string,
    secondKey: string
  ): ValidationErrors | undefined {
    return function (group: FormGroup): ValidationErrors | undefined {
      if (group.controls[firstKey].value !== group.controls[secondKey].value) {
        return {
          missmatch: true,
        };
      }

      return undefined;
    };
  }

  public handleRadioChange(id: number) {
    this.isShowTeam.set(id !== 1);

    if (this.isShowTeam()) {
      this.userForm().addControl(
        'teamID',
        new FormControl(0, Validators.required)
      );
    } else {
      this.userForm().removeControl('teamID');
    }
  }

  public onSave(): void {
    this.userForm().markAllAsTouched();

    if (this.userForm().valid) {
      const userData: User = {
        ...(this.userForm().value as User),
        teamID: this.isShowTeam()
          ? Number(this.userForm().get('teamID')?.value)
          : undefined,
        designationID: Number(this.userForm().get('designationID')?.value),
      };

      this.unsub.subs = this.usersService.addData(userData).subscribe({
        next: () => {
          this.userForm().reset();
          this.notificationService.showSuccess(ADDED_SUCCESS);
          this.reloadUser();
          this.setDefaultValue();
        },
        error: () => {
          this.notificationService.showError(ERROR_MESSAGE);
        },
      });
    }
  }

  private setDefaultValue(): void {
    this.userForm().patchValue({
      gender: 'Male',
      educationalLevelID: 1,
      roleID: 1,
    });
  }
  private reloadUser(): void {
    this.unsub.subs = this.usersService
      .loadUserAndSearch(this.currentPage ?? 0)
      .subscribe();
  }

  public onCancel(): void {
    this.cancelEvent.emit();
  }
}
