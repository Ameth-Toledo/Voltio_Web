import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  @Input() imgSrc = '';
  @Input() name = '';
  @Input() category = '';
  @Input() rating = '';

  constructor(private router: Router) {}

  navigateToProduct() {
    this.router.navigate(['/dashboard/products', this.name.toLowerCase().replace(/\s+/g, '-')]);
  }

  get categoryIcon(): string {
    const icons: Record<string, string> = {
      'Microcontroladores': 'M8 6V4m8 2V4m-8 14v2m8-2v2M4 9H2m2 3H2m2 3H2m18-6h2m-2 3h2m-2 3h2M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm4 3h8v6H8V9z',
      'Sensores': 'M12 12m-2 0a2 2 0 104 0 2 2 0 10-4 0M8.5 8.5a5 5 0 000 7m7-7a5 5 0 010 7M5.5 5.5a9 9 0 000 13m13-13a9 9 0 010 13',
      'Componentes': 'M3 3h18v18H3V3zm4 4h4v4H7V7zm6 0h4v4h-4V7zm-6 6h4v4H7v-4zm6 0h4v4h-4v-4z',
      'Herramientas y Equipos': 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z',
      'Kits de Desarrollo': 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
      'Robótica': 'M4 20h4M6 20v-4M6 16c0-4 3-6 6-6M12 10V6M9 6h6M12 6c0-1.5 1-3 3-3s3 1.5 3 3-1 3-3 3'
    };
    return icons[this.category] ?? 'M4 6h16M4 12h16M4 18h16';
  }
}