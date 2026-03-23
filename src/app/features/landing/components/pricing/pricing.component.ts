import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PricingPlan } from '../../models/pricing-plan.model';
import { loadScript } from '@paypal/paypal-js';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.css'
})
export class PricingComponent implements OnInit {
  processingPlan: string | null = null;
  selectedPlan: PricingPlan | null = null;
  showModal = false;
  paypalRendered = false;

  plans: PricingPlan[] = [
    {
      name: 'Básico',
      price: '$99',
      amount: 99,
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
      amount: 199,
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
      amount: 499,
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

  async ngOnInit() {
    await loadScript({
      clientId: environment.paypal.clientId,
      currency: environment.paypal.currency,
    });
  }

  selectPlan(plan: PricingPlan) {
    const isLoggedIn = !!localStorage.getItem('token');
    if (!isLoggedIn) {
      window.location.href = '/register';
      return;
    }

    this.selectedPlan = plan;
    this.showModal = true;
    this.paypalRendered = false;

    setTimeout(() => this.renderPayPalButtons(), 200);
  }

  closeModal() {
    this.showModal = false;
    this.selectedPlan = null;
    this.paypalRendered = false;
    this.processingPlan = null;
  }

  private async renderPayPalButtons() {
    if (this.paypalRendered || !this.selectedPlan) return;

    try {
      const paypal = (window as any).paypal;
      if (!paypal) return;

      const container = document.getElementById('paypal-modal-container');
      if (!container) return;

      container.innerHTML = '';
      this.paypalRendered = true;

      const plan = this.selectedPlan;

      paypal.Buttons({
        createOrder: (_data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: plan.amount.toString(),
                currency_code: environment.paypal.currency
              },
              description: `Plan ${plan.name} - Voltio`
            }]
          });
        },
        onApprove: async (_data: any, actions: any) => {
          const order = await actions.order.capture();
          console.log('Pago exitoso:', order);
          this.processingPlan = null;
          this.closeModal();
          alert(`¡Pago exitoso! Bienvenido al plan ${plan.name}`);
        },
        onCancel: () => {
          this.processingPlan = null;
        },
        onError: (err: any) => {
          console.error('Error en pago:', err);
          this.processingPlan = null;
        },
        style: {
          layout: 'vertical',
          color: 'black',
          shape: 'rect',
          label: 'pay'
        }
      }).render('#paypal-modal-container');

    } catch (err) {
      console.error(err);
    }
  }
}