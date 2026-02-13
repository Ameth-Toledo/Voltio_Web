import { Component } from '@angular/core';
import { LucideAngularModule, ArrowRight } from 'lucide-angular';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  readonly ArrowRight = ArrowRight;
}
