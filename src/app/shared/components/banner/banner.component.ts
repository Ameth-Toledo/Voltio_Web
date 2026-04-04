import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.css'
})
export class BannerComponent implements OnInit, OnDestroy {
  currentSlide = 0;
  autoplayInterval: any;

  slides = [
    'https://static.vecteezy.com/system/resources/thumbnails/003/226/128/small/social-media-marketing-web-banner-digital-marketing-cover-banner-vector.jpg',
    'https://static.vecteezy.com/system/resources/thumbnails/001/820/662/small/business-banner-template-simple-geometric-style-vector.jpg',
    'https://www.adobe.com/mx/products/illustrator/media_16249e7e9719df685a92c2158f8413e738aa2f4f0.jpg?width=750&format=jpg&optimize=medium',
    'https://as2.ftcdn.net/jpg/05/07/84/11/1000_F_507841163_hLAVUkLuhzaEB1BswsBbNuwsaqgmbvWn.jpg'
  ];

  ngOnInit(): void {
    this.startAutoplay();
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
    this.resetAutoplay();
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    this.resetAutoplay();
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.resetAutoplay();
  }

  startAutoplay(): void {
    this.autoplayInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  stopAutoplay(): void {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
    }
  }

  resetAutoplay(): void {
    this.stopAutoplay();
    this.startAutoplay();
  }
}