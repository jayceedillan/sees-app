import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer2,
  signal,
} from '@angular/core';

import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { PaginationComponent } from '../pagination/pagination.component';

type dynamic = { [key: string]: any };

@Component({
  selector: 'sees-lib-tables',
  standalone: true,
  templateUrl: './tables.component.html',
  styleUrl: './tables.component.scss',
  imports: [PaginationComponent, CommonModule, ConfirmationModalComponent],
})
export class TablesComponent {
  @Input() columns: string[] = [];
  @Input() data: { [key: string]: any }[] = [];
  @Input() currentPage = 0;
  @Input() totalRowsCount = 0;
  @Input() showLoader = true;
  @Input() description?: string;
  @Input() isShowActiveAndInActiveButtons = false;
  @Output() deleteEvent: EventEmitter<dynamic> = new EventEmitter<dynamic>();
  @Output() editEvent: EventEmitter<dynamic> = new EventEmitter<dynamic>();
  @Output() isActiveEvent: EventEmitter<dynamic> = new EventEmitter<dynamic>();
  @Output() pageChange = new EventEmitter<number>();

  public isConfirmShowModal = signal<boolean>(false);
  private currentSelected = signal<Record<string, any>>({});

  constructor(private renderer: Renderer2, private elementRef: ElementRef) {}

  // ngAfterViewInit() {
  //   const tableCells =
  //     this.elementRef.nativeElement.querySelectorAll('.table-cell');
  //   tableCells.forEach((cell: HTMLElement) => {
  //     const longTextElement = cell.querySelector('.show-long-text');
  //     if (longTextElement) {
  //       if (longTextElement.scrollWidth > longTextElement.clientWidth) {
  //         this.renderer.addClass(longTextElement, 'show-tooltip');
  //       }
  //     }
  //   });
  // }

  public convertCamelCaseToSpacedString(input: string): string {
    return input
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/^./, (str) => str.toUpperCase());
  }

  public selectedEditItem(item: dynamic): void {
    this.editEvent.emit(item);
  }

  public selectedDeleteItem(item: dynamic): void {
    this.currentSelected.set(item);
    this.toggleModal();
  }

  public onDelete(): void {
    this.toggleModal();
    this.deleteEvent.emit(this.currentSelected());
  }

  public onCancel(): void {
    this.toggleModal();
  }

  private toggleModal(): void {
    this.isConfirmShowModal.set(!this.isConfirmShowModal());
  }

  public loadPageNumber(pageNumber: number): void {
    this.pageChange.emit(pageNumber);
  }

  public isActive(item: dynamic, isActive: boolean): void {
    item['isActive'] = isActive;
    this.isActiveEvent.emit(item);
  }
}
