import { CommonModule } from '@angular/common';
import { Component, HostListener, Input } from '@angular/core';
import { LucideAngularModule, Bell, ChevronDown, User, CreditCard, Settings, LogOut } from 'lucide-angular';
import { NotifyModalComponent } from '../notify-modal/notify-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [LucideAngularModule, CommonModule, NotifyModalComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  @Input() pageTitle = 'Dashboard';
  @Input() pageSubtitle?: string;

  readonly Bell = Bell;
  readonly ChevronDown = ChevronDown;
  readonly User = User;
  readonly CreditCard = CreditCard;
  readonly Settings = Settings;
  readonly LogOut = LogOut;

  isDropdownOpen = false;
  isNotificationsOpen = false;

  constructor (private router: Router) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown-container')) {
      this.isDropdownOpen = false;
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleNotifications() {
    this.isNotificationsOpen = !this.isNotificationsOpen;
  }

  closeNotifications() {
    this.isNotificationsOpen = false;
  }

  sendToProfile(event: Event) {
    event.stopPropagation();
    this.isDropdownOpen = false;
    this.router.navigate(['dashboard/profile']);
  }

  sendToSettings(event: Event) {
    event.stopPropagation();
    this.isDropdownOpen = false;
    this.router.navigate(['dashboard/settings']);
  }

  sendToSubscription(event: Event) {
    event.stopPropagation();
    this.isDropdownOpen = false;
    this.router.navigate(['dashboard/subscription']);
  }
}