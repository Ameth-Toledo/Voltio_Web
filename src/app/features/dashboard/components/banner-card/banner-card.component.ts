import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Trash2, Eye, EyeOff } from 'lucide-angular';
import { Banner } from '../../models/Banner';

@Component({
  selector: 'app-banner-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './banner-card.component.html',
  styleUrl: './banner-card.component.css'
})
export class BannerCardComponent {
  @Input() banner!: Banner;
  @Output() toggle = new EventEmitter<number>();
  @Output() deleteItem = new EventEmitter<number>();

  readonly Trash2 = Trash2;
  readonly Eye = Eye;
  readonly EyeOff = EyeOff;

  getCTR(): string {
    if (this.banner.vistas === 0) return '0%';
    return ((this.banner.clicks / this.banner.vistas) * 100).toFixed(1) + '%';
  }
}