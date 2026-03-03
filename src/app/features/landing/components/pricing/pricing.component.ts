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
      name: 'Gratis',
      price: '$0',
      period: 'para siempre',
      description: 'Ideal para compradores y exploradores del catálogo.',
      features: [
        'Acceso al catálogo completo',
        'Búsqueda de productos',
        'Comparar precios entre tiendas',
        'Lista de deseos',
      ],
      cta: 'Comenzar gratis',
      popular: false
    },
    {
      name: 'Vendedor',
      price: '$199',
      period: 'por mes',
      description: 'Para tiendas pequeñas que quieren crecer en línea.',
      features: [
        'Todo lo del plan Gratis',
        'Hasta 50 productos publicados',
        'Panel de vendedor',
        'Estadísticas básicas',
        'Soporte por correo',
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
