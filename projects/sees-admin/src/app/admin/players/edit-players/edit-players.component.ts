import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
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
import {
  DatePickerComponent,
  DropDownListComponent,
  InputFieldComponent,
  ModalFormComponent,
} from '../../../../../../sees-lib/src/public-api';
import { SportsService } from '../../sports/service/sports.service';
import { TeamsService } from '../../team/service/teams.service';
import {
  EducationalLevel,
  Players,
  PlayersWithSports,
} from '../players.interface';
import { PlayersService } from '../service/players.service';
import { format } from 'date-fns';

@Component({
  selector: 'sees-app-edit-players',
  standalone: true,
  templateUrl: './edit-players.component.html',
  styleUrl: './edit-players.component.scss',
  providers: [UnsubscribeService],
  imports: [
    ModalFormComponent,
    InputFieldComponent,
    DatePickerComponent,
    CommonModule,
    ReactiveFormsModule,
    WebcamModule,
    DropDownListComponent,
  ],
})
export class EditPlayersComponent {
  @Input() players?: Players;
  @Input() currentPage?: number;
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
  public selectedDate = signal<string>('');

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
    this.updateDateOfBirth();
    this.imageUrl.set(this.players?.profilePic ?? this.defaultImage());
  }

  private loadDatas(): void {
    this.unsub.subs = combineLatest({
      teams: this.teamService
        .getAllTeams()
        .pipe(
          map((teams) =>
            teams.map((team) => ({ name: team.teamName, value: team.teamID }))
          )
        ),
      sports: this.sportsService.getAllSports().pipe(
        map((sports) =>
          sports.map((playerSport) => ({
            name: playerSport.sportName,
            value: playerSport.sportID,
            control: new FormControl(this.isSportIDExist(playerSport.sportID)),
          }))
        )
      ),
      educationLevels: this.playersService.loadEducationalLevel(),
    }).subscribe(({ teams, sports, educationLevels }) => {
      this.teams.set(teams);
      this.sports.set(sports);
      this.educationLevels.set(educationLevels);
    });
  }

  private isSportIDExist(sportID: number): boolean {
    return (
      this.players?.playerSports.some(
        (playerSport) => playerSport.sport.sportID === sportID
      ) ?? false
    );
  }

  private initForm(): void {
    this.playerForm.set(
      this.formBuilder.group({
        firstName: [this.players?.firstName, Validators.required],
        middleInitial: [this.players?.middleInitial, Validators.required],
        lastName: [this.players?.lastName, Validators.required],
        contactNo: [this.players?.contactNo],
        height: [this.players?.height],
        weight: [this.players?.weight],
        dateOfBirth: [this.players?.dateOfBirth, Validators.required],
        emailAddress: [this.players?.emailAddress, [Validators.email]],
        educationalLevelID: [
          this.players?.educationalLevel.educationalLevelID,
          Validators.required,
        ],
        teamID: [this.players?.team.teamID, Validators.required],
        gender: [this.players?.gender, this.formBuilder.array([])],
      })
    );
  }

  public updateDateOfBirth(): void {
    const { dateOfBirth, formattedDate } = this.getAndFormatPlayerDateOfBirth();

    this.onDateChanged(dateOfBirth);
    this.selectedDate.set(formattedDate);
  }

  private getAndFormatPlayerDateOfBirth(): {
    dateOfBirth: Date;
    formattedDate: string;
  } {
    const dateOfBirth = this.players?.dateOfBirth
      ? new Date(this.players.dateOfBirth)
      : new Date();
    const formattedDate = format(dateOfBirth, 'MM/dd/yyyy');
    return { dateOfBirth, formattedDate };
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

  public onSave(): void {
    this.playerForm().markAllAsTouched();
    if (!this.playerForm().valid) {
      return;
    }

    const sportIds = this.getCheckedSportsIds();
    const playersWithSports = this.createPlayersWithSports(
      this.players?.playerID,
      sportIds
    );

    this.unsub.subs = this.playersService
      .updatePlayer(playersWithSports)
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

  private createPlayersWithSports(
    playerID: number | undefined,
    sportIds: number[]
  ): PlayersWithSports {
    const player = this.playerForm().value;
    return {
      sportIds: sportIds,
      player: {
        ...player,
        playerID: playerID,
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
