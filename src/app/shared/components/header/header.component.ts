import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Menu, X, Search, Heart, ArrowRight } from 'lucide-angular';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements AfterViewInit, OnDestroy {
  readonly Menu = Menu;
  readonly X = X;
  readonly Search = Search;
  readonly Heart = Heart;
  readonly ArrowRight = ArrowRight;

  @ViewChild('headerNav') headerNav!: ElementRef;

  scrollY = 0;
  searchQuery = '';
  mobileMenuOpen = false;
  mobileSearchOpen = false;
  currentRoute = '';
  private routerSubscription?: Subscription;

  constructor(private router: Router) {}

  ngAfterViewInit() {
    this.currentRoute = this.router.url;
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute = event.url;
      });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrollY = window.scrollY;
  }

  get visible(): boolean {
    return this.scrollY > 100;
  }

  get navStyles() {
    return {
      'backdrop-filter': this.visible ? 'blur(10px)' : 'none',
      'background-color': this.visible ? 'rgba(211, 223, 255, 0.8)' : 'rgb(211, 223, 255)',
      'box-shadow': this.visible
        ? '0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset'
        : 'none',
      'width': this.visible ? '60%' : '95%',
      'max-width': this.visible ? '800px' : '95%',
      'transform': this.visible ? 'translateY(20px)' : 'translateY(0)',
      'min-width': '280px',
      'border-radius': this.visible ? '9999px' : '12px'
    };
  }

  isActive(path: string): boolean {
    return this.currentRoute === path;
  }

  handleSearch(event: Event) {
    event.preventDefault();
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: this.searchQuery.trim() } });
      this.searchQuery = '';
      this.mobileSearchOpen = false;
    }
  }

  handleNavClick() {
    this.mobileMenuOpen = false;
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  toggleMobileSearch() {
    this.mobileSearchOpen = !this.mobileSearchOpen;
  }

  ngOnDestroy() {
    this.routerSubscription?.unsubscribe();
  }

  sendToLogin(event: Event) {
    event.preventDefault();
    this.router.navigate(['login'])
  }
}