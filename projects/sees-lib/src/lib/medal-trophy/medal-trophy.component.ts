import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedalColor } from './color.enum';

@Component({
  selector: 'sees-lib-medal-trophy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './medal-trophy.component.html',
  styleUrl: './medal-trophy.component.scss',
})
export class MedalTrophyComponent {
  @Input() medalColor: string = MedalColor.GOLD;
  @Input() medalName?: string;
}
