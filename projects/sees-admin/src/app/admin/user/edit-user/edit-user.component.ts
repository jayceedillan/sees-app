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
  DropDownListComponent,
  InputFieldComponent,
  ModalFormComponent,
} from '../../../../../../sees-lib/src/public-api';
import { CommonModule } from '@angular/common';
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
import { UnsubscribeService } from '../../../../../../../common/UnsubscribeService';
import { combineLatest, map } from 'rxjs';
import {
  GENDER,
  ADDED_SUCCESS,
  ERROR_MESSAGE,
} from '../../../../../../../conts/app.const';
import { NotificationService } from '../../../../../../../service/notification.service';
import { NamedValue } from '../../namedValue.interface';
import { EducationalLevel } from '../../players/players.interface';
import { PlayersService } from '../../players/service/players.service';
import { TeamsService } from '../../team/service/teams.service';
import { PasswordValidatorService } from '../service/password-validator.service';
import { UsersService } from '../service/users.service';
import { Role, User } from '../user.interface';

@Component({
  selector: 'sees-app-edit-user',
  standalone: true,
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss',
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
export class EditUserComponent {
  @Input() currentPage?: number;
  @Input() user?: User;
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
          firstName: new FormControl(this.user?.firstName, [
            Validators.required,
          ]),
          middleName: new FormControl(this.user?.middleName, [
            Validators.required,
          ]),
          lastName: new FormControl(this.user?.lastName, [Validators.required]),
          emailAddress: new FormControl(this.user?.emailAddress, [
            Validators.required,
            Validators.email,
          ]),
          contactNo: new FormControl(this.user?.contactNo),
          gender: new FormControl(this.user?.gender),
          userName: new FormControl(this.user?.username, [Validators.required]),
          educationalLevelID: new FormControl(
            this.user?.educationalLevel.educationalLevelID,
            [Validators.required]
          ),
          designationID: new FormControl(this.user?.designation.designationID, [
            Validators.required,
          ]),
          roleID: new FormControl(this.user?.role.roleID, [
            Validators.required,
          ]),
          password: new FormControl(this.user?.password, [
            Validators.required,
            Validators.minLength(6),
            this.passwordValidatorService.strongPasswordValidator(),
          ]),

          confirmPassword: new FormControl(this.user?.password, [
            Validators.required,
          ]),
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
