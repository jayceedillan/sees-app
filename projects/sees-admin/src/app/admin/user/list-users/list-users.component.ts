import {
  Component,
  OnInit,
  Self,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  SearchBarButtonComponent,
  TablesComponent,
} from '../../../../../../sees-lib/src/public-api';
import { UnsubscribeService } from '../../../../../../../common/UnsubscribeService';
import { UsersService } from '../service/users.service';
import { NotificationService } from '../../../../../../../service/notification.service';
import {
  COLUMN_NAME_USER,
  CURRENT_PAGE,
  DELETED_FAILED,
  DELETED_SUCESS,
} from '../../../../../../../conts/app.const';
import { User } from '../user.interface';
import { AddUserComponent } from '../add-user/add-user.component';
import { CommonModule } from '@angular/common';
import { EditUserComponent } from '../edit-user/edit-user.component';

@Component({
  selector: 'sees-app-list-users',
  standalone: true,
  templateUrl: './list-users.component.html',
  styleUrl: './list-users.component.scss',
  providers: [UnsubscribeService],
  imports: [
    SearchBarButtonComponent,
    TablesComponent,
    AddUserComponent,
    CommonModule,
    EditUserComponent,
  ],
})
export class ListUsersComponent implements OnInit {
  public isAddShowModal = signal<boolean>(false);
  public isEditShowModal = signal<boolean>(false);

  public currentPage = signal(CURRENT_PAGE);
  public columns = signal<string[]>(COLUMN_NAME_USER);
  public selectedUser = signal<User>({} as User);

  private usersService = inject(UsersService);
  private notificationService = inject(NotificationService);

  constructor(@Self() private unsub: UnsubscribeService) {}

  public userData = computed(() => {
    const usersSignal = this.usersService.getUsers();

    const transformedUsers = usersSignal().data.map((user) => {
      return {
        ...user,
        designationName: user.designation
          ? user.designation.designationName
          : null,
        roleName: user.role.roleName,
        educationalLevelName: user.educationalLevel.educationalLevelName,
        teamName: user.team?.teamName ?? '',
      };
    });

    return {
      players: transformedUsers,
      totalRowsCount: usersSignal().totalCount,
    };
  });

  ngOnInit(): void {
    this.onLoadAndSearch();
  }

  public onLoadAndSearch(searchQuery?: string): void {
    this.unsub.subs = this.usersService
      .loadUserAndSearch(this.currentPage(), searchQuery)
      .subscribe();
  }

  public openModal(): void {
    this.isAddShowModal.set(!this.isAddShowModal());
  }

  public onCancel(): void {
    this.openModal();
  }

  public loadPerPage(currentPage: number): void {
    this.currentPage.set(currentPage);
    this.onLoadAndSearch();
  }

  public onDelete(user: { [key: string]: any }): void {
    const { userID } = user as User;
    this.unsub.subs = this.usersService.deleteData(userID).subscribe({
      next: () => {
        this.loadPerPage(this.currentPage());
        this.notificationService.showSuccess(DELETED_SUCESS);
      },
      error: () => {
        this.notificationService.showError(`${DELETED_FAILED} user`);
      },
    });
  }

  public onEdit(user: { [key: string]: any }): void {
    this.isEditShowModal.set(true);
    this.selectedUser.set(user as User);
  }

  public onAddCancel(): void {
    this.openAddModal();
  }

  public openAddModal(): void {
    this.isAddShowModal.set(!this.isAddShowModal());
  }

  public onCancelEdit(): void {
    this.isEditShowModal.set(false);
  }
}
