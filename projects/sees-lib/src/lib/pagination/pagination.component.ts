import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  computed,
} from '@angular/core';

@Component({
  selector: 'sees-lib-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent {
  @Input() currentPage: number = 0;
  @Input() totalRowsCount: number = 0;
  @Output() pageChange = new EventEmitter<number>();

  public totalPagesArray: number[] = [];
  public totalPages = computed(() => Math.ceil(this.totalRowsCount / 5));
  public getPagesToShow(): number[] {
    const pagesToShow = [];

    let startPage = Math.max(1, this.currentPage - 9);
    while (startPage <= this.totalPages()) {
      pagesToShow.push(startPage);
      startPage++;
    }

    return pagesToShow;
  }

  public setPage(page: number): void {
    if (page >= 1 && page <= this.totalRowsCount) {
      this.pageChange.emit(page);
    }
  }

  public prevPage(): void {
    if (this.currentPage > 1) {
      this.setPage(this.currentPage - 1);
    }
  }

  public nextPage(): void {
    if (this.currentPage < this.totalRowsCount) {
      this.setPage(this.currentPage + 1);
    }
  }
}
