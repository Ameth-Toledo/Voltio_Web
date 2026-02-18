import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-android',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './android.component.html',
  styleUrl: './android.component.css'
})
export class AndroidComponent {
  @Input() width: number = 433;
  @Input() height: number = 882;
  @Input() src?: string;
  @Input() videoSrc?: string;
  @Input() className: string = '';
}
