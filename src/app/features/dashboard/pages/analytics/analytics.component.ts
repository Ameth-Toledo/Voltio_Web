import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { LucideAngularModule, TrendingUp, ShoppingCart, Package, DollarSign } from 'lucide-angular';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, NavbarComponent, LucideAngularModule, BaseChartDirective],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.css'
})
export class AnalyticsComponent {
  readonly TrendingUp = TrendingUp;
  readonly ShoppingCart = ShoppingCart;
  readonly Package = Package;
  readonly DollarSign = DollarSign;

  stats = [
    { label: 'Ventas totales', value: '$48.2K', change: '+12.5%', positive: true, icon: 'DollarSign', color: 'green' },
    { label: 'Pedidos', value: '384', change: '+8.2%', positive: true, icon: 'ShoppingCart', color: 'blue' },
    { label: 'Productos activos', value: '12', change: '+2', positive: true, icon: 'Package', color: 'purple' },
    { label: 'Ticket promedio', value: '$125', change: '-3.1%', positive: false, icon: 'TrendingUp', color: 'yellow' },
  ];

  salesChartData: ChartData<'line'> = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    datasets: [
      {
        label: 'Ventas 2024',
        data: [3200, 4100, 3800, 5200, 4800, 6100, 5500, 7200, 6800, 8100, 7500, 9200],
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#6366f1',
        pointRadius: 4,
      }
    ]
  };

  salesChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        grid: { color: 'rgba(0,0,0,0.05)' },
        ticks: { callback: (value) => '$' + value }
      }
    }
  };

  ordersChartData: ChartData<'bar'> = {
    labels: ['Pendiente', 'Confirmada', 'En proceso', 'Completada', 'Cancelada'],
    datasets: [
      {
        label: 'Pedidos',
        data: [45, 82, 63, 194, 20],
        backgroundColor: [
          'rgba(250, 204, 21, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderRadius: 8,
      }
    ]
  };

  ordersChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: 'rgba(0,0,0,0.05)' } }
    }
  };

  categoryChartData: ChartData<'doughnut'> = {
    labels: ['Microcontroladores', 'Sensores', 'Componentes', 'Herramientas', 'Kits', 'Robótica'],
    datasets: [
      {
        data: [30, 20, 15, 12, 14, 9],
        backgroundColor: [
          '#6366f1',
          '#3b82f6',
          '#22c55e',
          '#f59e0b',
          '#ec4899',
          '#14b8a6',
        ],
        borderWidth: 0,
        hoverOffset: 8,
      }
    ]
  };

  categoryChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: { padding: 16, usePointStyle: true }
      }
    },
    cutout: '70%',
  };
}