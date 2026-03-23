import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PricingPlan } from '../../models/pricing-plan.model';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.css'
})
export class PricingComponent {
  plans: PricingPlan[] = [
    {
      name: 'Básico',
      price: '$99',
      period: 'por mes',
      description: 'Para vendedores que están comenzando en línea.',
      features: [
        'Hasta 50 productos publicados',
        'Panel de vendedor',
        'Estadísticas básicas',
        'Soporte por correo',
      ],
      cta: 'Comenzar',
      popular: false
    },
    {
      name: 'Vendedor',
      price: '$199',
      period: 'por mes',
      description: 'Para tiendas en crecimiento que necesitan más alcance.',
      features: [
        'Todo lo del plan Básico',
        'Hasta 100 productos publicados',
        'Estadísticas avanzadas',
        'Posicionamiento destacado',
        'Soporte prioritario',
      ],
      cta: 'Empezar a vender',
      popular: true
    },
    {
      name: 'Pro',
      price: '$499',
      period: 'por mes',
      description: 'Para tiendas grandes que necesitan potencia y control total.',
      features: [
        'Todo lo del plan Vendedor',
        'Productos ilimitados',
        'Analytics avanzado',
        'Posicionamiento prioritario',
        'Soporte prioritario 24/7',
      ],
      cta: 'Ir al Pro',
      popular: false
    }
  ];
}
