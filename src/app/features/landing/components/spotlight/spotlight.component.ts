import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-spotlight',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spotlight.component.html',
  styleUrl: './spotlight.component.css'
})
export class SpotlightComponent {
  @Input() className?: string;
  @Input() fill: string = 'white';
  @Input() isVisible: boolean = false;
}
