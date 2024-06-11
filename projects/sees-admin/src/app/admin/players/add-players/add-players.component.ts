import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  Self,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { WebcamImage, WebcamModule } from 'ngx-webcam';
import { Subject, combineLatest, map } from 'rxjs';
import { UnsubscribeService } from '../../../../../../../common/UnsubscribeService';
import {
  ADDED_SUCCESS,
  DEFAULT_IMAGE,
  ERROR_MESSAGE,
} from '../../../../../../../conts/app.const';
import { NotificationService } from '../../../../../../../service/notification.service';
import { ModalFormComponent } from '../../../../../../sees-lib/src/lib/modal-form/modal-form.component';
import {
  DatePickerComponent,
  InputFieldComponent,
} from '../../../../../../sees-lib/src/public-api';
import { SportsService } from '../../sports/service/sports.service';
import { TeamsService } from '../../team/service/teams.service';
import {
  EducationalLevel,
  Players,
  PlayersWithSports,
} from '../players.interface';
import { PlayersService } from '../service/players.service';

@Component({
  selector: 'sees-app-add-players',
  standalone: true,
  templateUrl: './add-players.component.html',
  styleUrl: './add-players.component.scss',
  providers: [UnsubscribeService],
  imports: [
    ModalFormComponent,
    InputFieldComponent,
    DatePickerComponent,
    CommonModule,
    ReactiveFormsModule,
    WebcamModule,
  ],
})
export class AddPlayersComponent {
  @Output() cancelEvent: EventEmitter<void> = new EventEmitter();

  private sportsService = inject(SportsService);
  private teamService = inject(TeamsService);
  private playersService = inject(PlayersService);
  private notificationService = inject(NotificationService);

  public defaultImage = signal(DEFAULT_IMAGE);
  public imageUrl = signal<string | ArrayBuffer | null>(this.defaultImage());
  public educationLevels = signal<EducationalLevel[]>([]);
  public age = signal<number>(0);
  public genders = signal<string[]>(['Male', 'Female']);
  public isTakePhoto = signal<boolean>(false);

  public sports = signal<
    { name: string; value: number; control: FormControl<boolean | null> }[]
  >([]);
  public teams = signal<{ name: string; value: number }[]>([]);

  private formBuilder = inject(FormBuilder);
  public playerForm = signal<FormGroup>(this.formBuilder.group({}));

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  public triggerObservable: Subject<void> = new Subject<void>();

  constructor(@Self() private unsub: UnsubscribeService) {}

  ngOnInit(): void {
    this.loadDatas();
    this.initForm();
  }

  private loadDatas(): void {
    this.unsub.subs = combineLatest(
      this.teamService
        .getAllTeams()
        .pipe(
          map((teams) =>
            teams.map((team) => ({ name: team.teamName, value: team.teamID }))
          )
        ),
      this.sportsService.getAllSports().pipe(
        map((sports) =>
          sports.map((sport) => ({
            name: sport.sportName,
            value: sport.sportID,
            control: new FormControl(false),
          }))
        )
      ),
      this.playersService.loadEducationalLevel()
    ).subscribe(([teams, sports, educationLevels]) => {
      this.teams.set(teams);
      this.sports.set(sports);
      this.educationLevels.set(educationLevels);
    });
  }

  private initForm(): void {
    this.playerForm.set(
      this.formBuilder.group({
        firstName: ['', Validators.required],
        middleInitial: ['', Validators.required],
        lastName: ['', Validators.required],
        contactNo: [''],
        height: [''],
        weight: [''],
        dateOfBirth: ['', Validators.required],
        emailAddress: ['', [Validators.email]],
        educationalLevelID: [1, Validators.required],
        teamID: [null, Validators.required],
        sports: this.formBuilder.array([]),
        gender: ['Male', this.formBuilder.array([])],
      })
    );
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
      this.imageUrl.set(reader.result as string | ArrayBuffer | null);
    };
    reader.readAsDataURL(file);
  }

  public onSave(): void {
    this.playerForm().markAllAsTouched();
    if (!this.playerForm().valid) {
      return;
    }

    const sportIds = this.getCheckedSportsIds();
    const playersWithSports = this.createPlayersWithSports(sportIds);

    this.unsub.subs = this.playersService
      .addPlayerWithSports(playersWithSports)
      .subscribe({
        next: () => {
          this.playerForm().reset();
          this.notificationService.showSuccess(ADDED_SUCCESS);
          this.unsub.subs = this.playersService.loadPlayers(1).subscribe();
        },
        error: () => {
          this.notificationService.showError(ERROR_MESSAGE);
        },
      });
  }

  private createPlayersWithSports(sportIds: number[]): PlayersWithSports {
    const player = this.playerForm().value;
    return {
      sportIds: sportIds,
      player: {
        ...player,
        teamID: Number(player.teamID),
        profilePic: this.imageUrl(),
      } as Players,
    };
  }

  private getCheckedSportsIds(): number[] {
    return this.sports()
      .filter((sport) => sport.control.value === true)
      .map((sport) => sport.value);
  }

  public onCancel(): void {
    this.cancelEvent.emit();
  }

  public onDateChanged(date: Date): void {
    this.age.set(this.playersService.onDateChanged(date));
    this.playerForm().patchValue({ dateOfBirth: date });
  }

  public handleImage(webcamImage: WebcamImage): void {
    this.imageUrl.set(webcamImage.imageAsDataUrl);
    this.isTakePhoto.set(false);
  }

  public captureImage(): void {
    this.triggerObservable.next();
  }

  public uploadPhoto(): void {
    this.isTakePhoto.set(false);
    this.fileInput.nativeElement.click();
  }

  public takePhoto(): void {
    this.isTakePhoto.set(true);
  }
}
