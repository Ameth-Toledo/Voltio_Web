import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { AndroidComponent } from "../android/android.component";
import { AnimationService } from '../../../../core/services/animation.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [AndroidComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent implements AfterViewInit {
  mockupImage = 'assets/screens/home.svg';

  @ViewChild('heroTitle') heroTitle!: ElementRef;
  @ViewChild('heroDescription') heroDescription!: ElementRef;
  @ViewChild('heroCta') heroCta!: ElementRef;
  @ViewChild('heroPhone') heroPhone!: ElementRef;

  constructor(private animationService: AnimationService) {}

  ngAfterViewInit() {
    const timeline = this.animationService.createTimeline();

    timeline
      .fromTo(this.heroTitle.nativeElement,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      )
      .fromTo(this.heroDescription.nativeElement,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        '-=0.4'
      )
      .fromTo(this.heroCta.nativeElement,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' },
        '-=0.3'
      )
      .fromTo(this.heroPhone.nativeElement,
        { opacity: 0, x: 100, rotation: 5 },
        { opacity: 1, x: 0, rotation: 0, duration: 1, ease: 'power3.out' },
        '-=0.8'
      );
  }
}