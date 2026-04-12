import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { LucideAngularModule, Check, Zap, Crown, Rocket, CreditCard, Calendar, AlertCircle, Loader } from 'lucide-angular';
import { SuscripcionService } from '../../services/suscripcion.service';
import { AuthService } from '../../../auth/services/auth.service';
import { PlanBackend, SuscripcionEstado } from '../../models/Suscripcion';
import { Plan } from '../../models/Plan';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [CommonModule, NavbarComponent, LucideAngularModule],
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.css'
})
export class SubscriptionComponent implements OnInit {
  readonly Check = Check;
  readonly Zap = Zap;
  readonly Crown = Crown;
  readonly Rocket = Rocket;
  readonly CreditCard = CreditCard;
  readonly Calendar = Calendar;
  readonly AlertCircle = AlertCircle;
  readonly Loader = Loader;

  // Estado
  suscripcion: SuscripcionEstado | null = null;
  planesBackend: PlanBackend[] = [];
  isLoading = true;
  isSuscribiendo = false;
  isCancelando = false;
  error: string | null = null;
  successMessage: string | null = null;

  // Metadatos visuales de los planes (iconos, colores)
  readonly planMeta: Record<string, { color: string; icon: any; features: string[]; limit: string }> = {
    basico: {
      color: 'blue',
      icon: Zap,
      limit: 'Hasta 50 productos',
      features: [
        'Hasta 50 productos publicados',
        'Panel de vendedor',
        'Estadísticas básicas',
        'Soporte por correo',
      ]
    },
    vendedor: {
      color: 'purple',
      icon: Crown,
      limit: 'Hasta 100 productos',
      features: [
        'Todo lo del plan Básico',
        'Hasta 100 productos publicados',
        'Estadísticas avanzadas',
        'Posicionamiento destacado',
        'Soporte prioritario',
      ]
    },
    pro: {
      color: 'orange',
      icon: Rocket,
      limit: 'Productos ilimitados',
      features: [
        'Todo lo del plan Vendedor',
        'Productos ilimitados',
        'Analytics avanzado',
        'Posicionamiento prioritario',
        'Soporte prioritario 24/7',
      ]
    }
  };

  constructor(
    private suscripcionService: SuscripcionService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Detectar retorno exitoso desde PayPal
    this.route.queryParams.subscribe(params => {
      if (params['subscription_id']) {
        this.successMessage = '¡Suscripción activada correctamente! Bienvenido a Voltio.';
      }
    });

    this.cargarDatos();
  }

  cargarDatos(): void {
    this.isLoading = true;
    const user = this.authService.getUser();
    if (!user) return;

    // Cargar planes
    this.suscripcionService.getPlanes('empresa').subscribe({
      next: (planes) => { this.planesBackend = planes; },
      error: () => {}
    });

    // Cargar estado de suscripción
    this.suscripcionService.getEstado(user.id).subscribe({
      next: (data) => {
        this.suscripcion = data;
        this.isLoading = false;
      },
      error: () => {
        // 404 = sin suscripción activa
        this.suscripcion = null;
        this.isLoading = false;
      }
    });
  }

  suscribirse(id_plan: number): void {
    if (this.isSuscribiendo) return;
    this.isSuscribiendo = true;
    this.error = null;

    this.suscripcionService.iniciarSuscripcion(id_plan).subscribe({
      next: ({ approveUrl }) => {
        // Redirigir al checkout de PayPal
        window.location.href = approveUrl;
      },
      error: (err) => {
        this.error = err.error?.error || 'Error al iniciar la suscripción';
        this.isSuscribiendo = false;
      }
    });
  }

  cancelarSuscripcion(): void {
    if (!confirm('¿Estás seguro de que deseas cancelar tu suscripción?')) return;
    this.isCancelando = true;

    this.suscripcionService.cancelar().subscribe({
      next: () => {
        this.isCancelando = false;
        this.cargarDatos();
      },
      error: (err) => {
        this.error = err.error?.error || 'Error al cancelar la suscripción';
        this.isCancelando = false;
      }
    });
  }

  // Helpers
  get planActualNombre(): string {
    return this.suscripcion?.nombre_plan ?? '';
  }

  get estaEnGracia(): boolean {
    return this.suscripcion?.estado === 'gracia';
  }

  get estadoBadgeClass(): string {
    switch (this.suscripcion?.estado) {
      case 'activa':   return 'bg-green-100 text-green-700';
      case 'gracia':   return 'bg-yellow-100 text-yellow-700';
      case 'vencida':  return 'bg-red-100 text-red-700';
      case 'cancelada': return 'bg-gray-100 text-gray-600';
      default:         return 'bg-gray-100 text-gray-600';
    }
  }

  get estadoLabel(): string {
    switch (this.suscripcion?.estado) {
      case 'activa':    return 'Activa';
      case 'gracia':    return `Período de gracia (${this.suscripcion?.dias_gracia_restantes} días)`;
      case 'vencida':   return 'Vencida';
      case 'cancelada': return 'Cancelada';
      default:          return 'Sin suscripción';
    }
  }

  formatFecha(fecha: string | null): string {
    if (!fecha) return '—';
    return new Date(fecha).toLocaleDateString('es-MX', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  }

  getMeta(nombre: string) {
    return this.planMeta[nombre] ?? this.planMeta['basico'];
  }

  getColorClasses(color: string, type: 'bg' | 'text' | 'border' | 'badge'): string {
    const map: Record<string, Record<string, string>> = {
      blue:   { bg: 'bg-blue-50',   text: 'text-blue-600',   border: 'border-blue-200',   badge: 'bg-blue-100 text-blue-700' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-700' },
      orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-700' },
    };
    return map[color]?.[type] ?? '';
  }
}
