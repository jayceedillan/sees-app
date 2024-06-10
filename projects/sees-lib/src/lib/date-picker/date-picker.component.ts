import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { format } from 'date-fns';
import { delay, range } from 'lodash';

@Component({
  selector: 'sees-lib-date-picker',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss',
})
export class DatePickerComponent {
  @Input() placeHolder = '';
  @Input() selectedDate?: string;
  @Output() selectedDateChanged: EventEmitter<Date> = new EventEmitter();

  public showCalendar = false;
  public currentMonth: Date = new Date();
  public selectedYear: number = this.currentMonth.getFullYear();
  public showYearDropdown = false;
  public daysInMonth: Date[] = [];
  @ViewChild('.highlighted-year', { static: true })
  public highlightedYearElement!: ElementRef;

  constructor(private cdr: ChangeDetectorRef, private renderer: Renderer2) {}
  ngOnInit(): void {
    this.daysInMonth = this.getDaysInMonth();
  }

  private getDaysInMonth(): Date[] {
    let year = this.selectedYear;
    let month = this.currentMonth.getMonth();

    if (this.selectedDate) {
      const selectedDate = new Date(this.selectedDate);
      year = selectedDate.getFullYear();
      month = selectedDate.getMonth();
    }

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return Array.from(
      { length: daysInMonth },
      (_, i) => new Date(year, month, i + 1)
    );
  }

  public toggleCalendar(): void {
    this.showCalendar = !this.showCalendar;

    delay(() => {
      this.daysInMonth = this.getDaysInMonth();
    }, 1000);
  }

  public prevMonth(): void {
    this.changeMonth('prev');
  }

  public nextMonth(): void {
    this.changeMonth('next');
  }

  private changeMonth(direction: 'prev' | 'next'): void {
    const newMonth = new Date(this.currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    this.currentMonth = newMonth;
    this.cdr.detectChanges();
  }

  public isToday(date: Date): boolean {
    const today = new Date();

    const formattedDate = this.formatDate(date);
    const formattedToday = this.formatDate(today);

    if (this.selectedDate) {
      return formattedToday === this.selectedDate;
    }
    return formattedDate === formattedToday;
  }

  public isSelected(date: Date): boolean {
    return this.selectedDate === this.formatDate(date);
  }

  public selectDate(date: Date): void {
    this.selectedDate = this.formatDate(date);
    this.showCalendar = false;

    const dateObject = new Date(this.selectedDate);

    this.selectedDateChanged.emit(dateObject);
    this.cdr.markForCheck();
  }

  public onEnter(): void {
    if (this.selectedDate) {
      this.currentMonth = new Date(this.selectedDate);
      this.selectDate(new Date(this.selectedDate));
    }
  }
  private formatDate(date: Date): string {
    return format(date, 'MM/dd/yyyy');
  }

  public selectYear(year: number): void {
    const selectedDate = new Date(this.selectedDate?.toString() ?? new Date());
    selectedDate.setFullYear(year);

    this.selectDate(selectedDate);
    this.selectedYear = year;
    this.showYearDropdown = false;
    this.cdr.detectChanges();
  }

  public toggleYearDropdown(): void {
    this.showYearDropdown = !this.showYearDropdown;

    const element = document.querySelector('.highlighted-year') as HTMLElement;
    if (element) {
      const container = this.findScrollableParent(element);
      if (container) {
        const containerHeight = container.clientHeight;
        const selectedYearOffset = element.offsetTop;
        const selectedYearHeight = element.offsetHeight;

        const targetScrollPosition =
          selectedYearOffset - containerHeight + selectedYearHeight;

        container.scrollTop = targetScrollPosition;
      }
    }

    this.cdr.markForCheck();
  }

  private findScrollableParent(
    element: HTMLElement | null
  ): HTMLElement | null {
    if (!element) return null;
    const style = getComputedStyle(element);
    const overflowY = style.overflowY;
    if (overflowY === 'auto' || overflowY === 'scroll') {
      return element;
    } else {
      return this.findScrollableParent(element.parentElement);
    }
  }

  get years(): number[] {
    const currentYear = new Date().getFullYear();
    return range(currentYear - 49, currentYear + 1);
  }

  public onClear(): void {
    this.selectedDate = undefined;
  }
}
