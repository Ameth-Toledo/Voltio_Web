import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { LucideAngularModule, Bell, ChevronDown, User, CreditCard, Settings, LogOut } from 'lucide-angular';
import { NotifyModalComponent } from '../notify-modal/notify-modal.component';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { AppNotification } from '../../models/Notification';
import { AuthService } from '../../../auth/services/auth.service';
import { UserResponse } from '../../../auth/models/auth.models';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [LucideAngularModule, CommonModule, NotifyModalComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  @Input() pageTitle = 'Dashboard';
  @Input() pageSubtitle?: string;

  readonly Bell       = Bell;
  readonly ChevronDown = ChevronDown;
  readonly User       = User;
  readonly CreditCard = CreditCard;
  readonly Settings   = Settings;
  readonly LogOut     = LogOut;

  isDropdownOpen      = false;
  isNotificationsOpen = false;
  notifications: AppNotification[] = [];
  unreadCount = 0;

  currentUser: UserResponse | null = null;

  constructor(
    private router:              Router,
    private notificationService: NotificationService,
    private authService:         AuthService,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUser();

    this.notificationService.init();
    this.notificationService.solicitarPermiso();

    this.notificationService.getNotifications().subscribe(n => {
      this.notifications = n;
    });

    this.notificationService.getUnreadCount().subscribe(count => {
      this.unreadCount = count;
    });
  }

  get displayName(): string {
    if (!this.currentUser) return '';
    const { name, lastname } = this.currentUser;
    return `${name} ${lastname}`.trim();
  }

  get initials(): string {
    if (!this.currentUser) return '?';
    const n = this.currentUser.name?.charAt(0) ?? '';
    const l = this.currentUser.lastname?.charAt(0) ?? '';
    return (n + l).toUpperCase() || '?';
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown-container')) {
      this.isDropdownOpen = false;
    }
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleNotifications(): void {
    this.isNotificationsOpen = !this.isNotificationsOpen;
    if (this.isNotificationsOpen) {
      this.notificationService.marcarTodasLeidas();
    }
  }

  closeNotifications(): void {
    this.isNotificationsOpen = false;
  }

  sendToProfile(event: Event): void {
    event.stopPropagation();
    this.isDropdownOpen = false;
    this.router.navigate(['dashboard/profile']);
  }

  sendToSettings(event: Event): void {
    event.stopPropagation();
    this.isDropdownOpen = false;
    this.router.navigate(['dashboard/settings']);
  }

  sendToSubscription(event: Event): void {
    event.stopPropagation();
    this.isDropdownOpen = false;
    this.router.navigate(['dashboard/subscription']);
  }

  logout(event: Event): void {
    event.stopPropagation();
    this.isDropdownOpen = false;
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
