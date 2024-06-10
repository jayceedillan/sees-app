import { Injectable, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  toastr = inject(ToastrService);
  constructor() {}

  public showSuccess(message: string): void {
    this.toastr.success(message);
  }

  public showError(message: string): void {
    this.toastr.error(message);
  }
}
