import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { format } from 'date-fns';

@Component({
  selector: 'sees-lib-custom-date-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './custom-date-picker.component.html',
  styleUrl: './custom-date-picker.component.scss',
})
export class CustomDatePickerComponent {
  showDatePicker: boolean = false;
  today: Date = new Date();
  currentMonth: number = 0;
  currentYear: number = 0;
  currentMonthName: string = '';
  daysInMonth: number[] = [];
  selectedDate: number = 0;
  displayDate: string = '';

  selectingYear: boolean = false;
  years: number[] = [];
  startYear: number = 2023; // Change this to the desired starting year

  ngOnInit(): void {
    this.currentMonth = this.today.getMonth();
    this.currentYear = this.today.getFullYear();
    this.updateMonth();
    this.generateYears();
  }

  toggleDatePicker(): void {
    this.showDatePicker = !this.showDatePicker;
  }

  updateMonth(): void {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    this.currentMonthName = firstDay.toLocaleString('default', {
      month: 'long',
    });
    this.daysInMonth = Array.from(
      { length: lastDay.getDate() },
      (_, i) => i + 1
    );
  }

  previousMonth(): void {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.updateMonth();
  }

  nextMonth(): void {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.updateMonth();
  }

  previousYear(): void {
    this.currentYear--;
    this.updateMonth();
  }

  nextYear(): void {
    this.currentYear++;
    this.updateMonth();
  }

  selectDate(day: number): void {
    if (day !== 0) {
      this.today = new Date(this.currentYear, this.currentMonth, day);
      this.selectedDate = day;
      const selectedDate = new Date(this.currentYear, this.currentMonth, day);
      this.displayDate = format(selectedDate, 'dd-MM-yyyy');
      this.showDatePicker = false;
    }
  }

  startSelectingYear(): void {
    this.selectingYear = true;
  }

  generateYears(): void {
    const numYears = 9; // Adjust this to show more/less years
    this.years = Array.from({ length: numYears }, (_, i) => this.startYear - i);
  }

  previousYears(): void {
    this.startYear -= 9;
    this.generateYears();
  }

  nextYears(): void {
    this.startYear += 9;
    this.generateYears();
  }

  selectYear(year: number): void {
    this.currentYear = year;
    this.selectingYear = false;
    this.updateMonth();
  }

  clearDate(): void {
    this.displayDate = ''; // Clear the displayed date string
    // Optionally clear any internal state or emit event
  }
}
