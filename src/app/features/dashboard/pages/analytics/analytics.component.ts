import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { LucideAngularModule, TrendingUp, ShoppingCart, Package, DollarSign, Loader } from 'lucide-angular';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/Order';
import { Product } from '../../models/Product';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, NavbarComponent, LucideAngularModule, BaseChartDirective],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.css'
})
export class AnalyticsComponent implements OnInit {
  readonly TrendingUp   = TrendingUp;
  readonly ShoppingCart = ShoppingCart;
  readonly Package      = Package;
  readonly DollarSign   = DollarSign;
  readonly Loader       = Loader;

  isLoading   = true;
  id_empresa: number | null = null;

  // ── Stats ─────────────────────────────────────────────────────────────────
  totalVentas    = 0;
  totalPedidos   = 0;
  totalProductos = 0;
  ticketPromedio = 0;

  // ── Gráfica: ventas por mes (line) ────────────────────────────────────────
  salesChartData: ChartData<'line'> = {
    labels: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
    datasets: [{
      label: 'Ventas',
      data: Array(12).fill(0),
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99,102,241,0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#6366f1',
      pointRadius: 4,
    }]
  };

  salesChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { callback: (v) => '$' + v } }
    }
  };

  // ── Gráfica: pedidos por estado (bar) ─────────────────────────────────────
  ordersChartData: ChartData<'bar'> = {
    labels: ['Pendiente','Confirmada','En proceso','Completada','Cancelada'],
    datasets: [{
      label: 'Pedidos',
      data: [0, 0, 0, 0, 0],
      backgroundColor: [
        'rgba(250,204,21,0.8)',
        'rgba(59,130,246,0.8)',
        'rgba(168,85,247,0.8)',
        'rgba(34,197,94,0.8)',
        'rgba(239,68,68,0.8)',
      ],
      borderRadius: 8,
    }]
  };

  ordersChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: 'rgba(0,0,0,0.05)' } }
    }
  };

  // ── Gráfica: productos por categoría (doughnut) ───────────────────────────
  categoryChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: ['#6366f1','#3b82f6','#22c55e','#f59e0b','#ec4899','#14b8a6','#f97316','#8b5cf6'],
      borderWidth: 0,
      hoverOffset: 8,
    }]
  };

  categoryChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'right', labels: { padding: 16, usePointStyle: true } } },
    cutout: '70%',
  };

  constructor(
    private authService:    AuthService,
    private productService: ProductService,
    private orderService:   OrderService,
    private http:           HttpClient,
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (!user) { this.isLoading = false; return; }

    this.http.get<any>(`${environment.apiUrl}/usuarios/${user.id}/empresa`).subscribe({
      next:  (empresa) => { this.id_empresa = empresa.id_empresa; this.cargarDatos(); },
      error: () => { this.isLoading = false; }
    });
  }

  private cargarDatos(): void {
    if (!this.id_empresa) { this.isLoading = false; return; }

    forkJoin({
      orders:   this.orderService.getByEmpresa(this.id_empresa),
      products: this.productService.getByEmpresa(this.id_empresa),
    }).subscribe({
      next: ({ orders, products }) => {
        this.calcularStats(orders, products);
        this.buildSalesChart(orders);
        this.buildOrdersChart(orders);
        this.buildCategoryChart(products);
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  private calcularStats(orders: Order[], products: Product[]): void {
    const completadas = orders.filter(o => o.estado_orden === 'completada');
    this.totalVentas    = completadas.reduce((s, o) => s + Number(o.monto_total), 0);
    this.totalPedidos   = orders.length;
    this.totalProductos = products.length;
    this.ticketPromedio = completadas.length > 0 ? this.totalVentas / completadas.length : 0;
  }

  private buildSalesChart(orders: Order[]): void {
    const currentYear = new Date().getFullYear();
    const monthlyData = Array(12).fill(0);

    orders
      .filter(o => o.estado_orden === 'completada')
      .forEach(o => {
        const fecha = new Date(o.fecha_orden);
        if (fecha.getFullYear() === currentYear) {
          monthlyData[fecha.getMonth()] += Number(o.monto_total);
        }
      });

    // Clonar para que Angular detecte el cambio
    this.salesChartData = {
      ...this.salesChartData,
      datasets: [{ ...this.salesChartData.datasets[0], data: monthlyData }]
    };
  }

  private buildOrdersChart(orders: Order[]): void {
    const estados = ['pendiente','confirmada','en_proceso','completada','cancelada'];
    const counts  = estados.map(e => orders.filter(o => o.estado_orden === e).length);

    this.ordersChartData = {
      ...this.ordersChartData,
      datasets: [{ ...this.ordersChartData.datasets[0], data: counts }]
    };
  }

  private buildCategoryChart(products: Product[]): void {
    const map = new Map<string, number>();
    products.forEach(p => {
      const cat = p.categoria ?? 'Sin categoría';
      map.set(cat, (map.get(cat) ?? 0) + 1);
    });

    const labels = Array.from(map.keys());
    const data   = Array.from(map.values());

    this.categoryChartData = {
      ...this.categoryChartData,
      labels,
      datasets: [{ ...this.categoryChartData.datasets[0], data }]
    };
  }

  // ── Helpers de formato ────────────────────────────────────────────────────

  formatMoney(value: number): string {
    if (value >= 1000) return '$' + (value / 1000).toFixed(1) + 'K';
    return '$' + value.toFixed(0);
  }
}
