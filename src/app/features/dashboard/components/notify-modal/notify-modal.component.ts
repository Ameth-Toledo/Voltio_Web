import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ArrowLeft, CheckCheck, Settings, Info, CheckCircle, AlertTriangle, XCircle, BellOff, MessageCircle } from 'lucide-angular';
import { AppNotification } from '../../models/Notification';
import { Filter } from '../../models/Filter';

@Component({
  selector: 'app-notify-modal',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './notify-modal.component.html',
  styleUrl: './notify-modal.component.css'
})
export class NotifyModalComponent {
  @Input() isOpen = false;
  @Input() notifications: AppNotification[] = [];
  @Output() closeModal = new EventEmitter<void>();

  readonly ArrowLeft = ArrowLeft;
  readonly CheckCheck = CheckCheck;
  readonly Settings = Settings;
  readonly Info = Info;
  readonly CheckCircle = CheckCircle;
  readonly AlertTriangle = AlertTriangle;
  readonly XCircle = XCircle;
  readonly BellOff = BellOff;
  readonly MessageCircle = MessageCircle;

  activeFilter = 'all';

  filters: Filter[] = [
    { id: 'all', label: 'Todas' },
    { id: 'chat', label: 'Mensajes' },
    { id: 'system', label: 'Sistema' }
  ];

  get notificacionesFiltradas(): AppNotification[] {
    if (this.activeFilter === 'chat') return this.notifications.filter(n => n.type === 'chat');
    if (this.activeFilter === 'system') return this.notifications.filter(n => n.type !== 'chat');
    return this.notifications;
  }

  close() {
    this.closeModal.emit();
  }
}
