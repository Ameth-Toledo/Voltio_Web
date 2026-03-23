import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { LucideAngularModule, Check, Zap, Crown, Rocket, CreditCard, Calendar, AlertCircle } from 'lucide-angular';
import { Router } from '@angular/router';
import { Plan } from '../../models/Plan';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [CommonModule, NavbarComponent, LucideAngularModule],
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.css'
})
export class SubscriptionComponent {
  readonly Check = Check;
  readonly Zap = Zap;
  readonly Crown = Crown;
  readonly Rocket = Rocket;
  readonly CreditCard = CreditCard;
  readonly Calendar = Calendar;
  readonly AlertCircle = AlertCircle;

  currentPlan = 'vendedor';

  subscription = {
    plan: 'Vendedor',
    status: 'Activa',
    nextBilling: '22 de Abril, 2026',
    amount: '$199',
    paymentMethod: 'PayPal',
    startDate: '22 de Marzo, 2026',
  };

  plans: Plan[] = [
    {
      id: 'basico',
      name: 'Básico',
      price: 99,
      period: 'por mes',
      description: 'Para vendedores que están comenzando.',
      limit: 'Hasta 50 productos',
      color: 'blue',
      icon: Zap,
      features: [
        'Hasta 50 productos publicados',
        'Panel de vendedor',
        'Estadísticas básicas',
        'Soporte por correo',
      ]
    },
    {
      id: 'vendedor',
      name: 'Vendedor',
      price: 199,
      period: 'por mes',
      description: 'Para tiendas en crecimiento.',
      limit: 'Hasta 100 productos',
      color: 'purple',
      icon: Crown,
      features: [
        'Todo lo del plan Básico',
        'Hasta 100 productos publicados',
        'Estadísticas avanzadas',
        'Posicionamiento destacado',
        'Soporte prioritario',
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 499,
      period: 'por mes',
      description: 'Para tiendas grandes.',
      limit: 'Productos ilimitados',
      color: 'orange',
      icon: Rocket,
      features: [
        'Todo lo del plan Vendedor',
        'Productos ilimitados',
        'Analytics avanzado',
        'Posicionamiento prioritario',
        'Soporte prioritario 24/7',
      ]
    }
  ];

  constructor(private router: Router) {}

  changePlan(planId: string) {
    if (planId === this.currentPlan) return;
    this.router.navigate(['/'], { fragment: 'precios' });
  }

  getColorClasses(color: string, type: 'bg' | 'text' | 'border' | 'badge') {
    const map: Record<string, Record<string, string>> = {
      blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-700' },
      orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-700' },
    };
    return map[color]?.[type] ?? '';
  }
}