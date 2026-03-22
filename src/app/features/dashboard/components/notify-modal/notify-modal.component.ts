import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ArrowLeft, CheckCheck, Settings, Info, CheckCircle, AlertTriangle, XCircle, BellOff } from 'lucide-angular';
import { Notification } from '../../models/Notification';
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
  @Output() closeModal = new EventEmitter<void>();

  readonly ArrowLeft = ArrowLeft;
  readonly CheckCheck = CheckCheck;
  readonly Settings = Settings;
  readonly Info = Info;
  readonly CheckCircle = CheckCircle;
  readonly AlertTriangle = AlertTriangle;
  readonly XCircle = XCircle;
  readonly BellOff = BellOff;

  activeFilter = 'all';

  filters: Filter[] = [
    { id: 'all', label: 'Sin leer' },
    { id: 'comments', label: 'Comentarios' },
    { id: 'launches', label: 'Lanzamientos' }
  ];

  notifications: Notification[] = [
    {
      id: 1,
      type: 'success',
      title: 'Hemos lanzado: Curso de Gemini',
      message: 'Aprende a usar Gemini AI desde cero',
      time: 'Hace 7 días',
      isNew: true
    },
    {
      id: 2,
      type: 'success',
      title: 'Hemos lanzado: Curso de Supabase',
      message: 'Backend as a Service con Supabase',
      time: 'Hace 8 días',
      isNew: true
    },
    {
      id: 3,
      type: 'info',
      title: 'Hemos lanzado: Curso de Investigación de Mercados y Tendencias',
      message: 'Aprende a analizar el mercado y tendencias',
      time: 'Hace 9 días',
      isNew: true
    },
    {
      id: 4,
      type: 'success',
      title: 'Hemos lanzado: Curso de Comunicación Digital Profesional',
      message: 'Mejora tu comunicación en el ámbito digital',
      time: 'Hace 11 días',
      isNew: true
    },
    {
      id: 5,
      type: 'info',
      title: 'Hemos lanzado: Curso de Álgebra Lineal para Machine Learning',
      message: 'Fundamentos matemáticos para ML',
      time: 'Hace 22 días',
      isNew: true
    },
    {
      id: 6,
      type: 'warning',
      title: 'Hemos lanzado: Álgebra Lineal: Fundamentos y Aplicaciones',
      message: 'Domina el álgebra lineal desde cero',
      time: 'Hace un mes',
      isNew: true
    },
    {
      id: 7,
      type: 'error',
      title: 'Hemos lanzado: Curso de Gestión Efectiva del Tiempo',
      message: 'Optimiza tu productividad personal',
      time: 'Hace un mes',
      isNew: true
    },
    {
      id: 8,
      type: 'success',
      title: 'Hemos lanzado: Curso de Fundamentos de Inteligencia Artificial',
      message: 'Introducción completa a la IA',
      time: 'Hace 2 meses',
      isNew: true
    }
  ];

  close() {
    this.closeModal.emit();
  }
}