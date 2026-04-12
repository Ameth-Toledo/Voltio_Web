import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import {
  LucideAngularModule, Search, Eye, ChevronLeft, ChevronRight,
  ShoppingBag, Loader, AlertCircle
} from 'lucide-angular';
import { Order } from '../../models/Order';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../../auth/services/auth.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, NavbarComponent, LucideAngularModule, FormsModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {

  // ── Iconos ───────────────────────────────────────────────────────────────
  readonly Search       = Search;
  readonly Eye          = Eye;
  readonly ChevronLeft  = ChevronLeft;
  readonly ChevronRight = ChevronRight;
  readonly ShoppingBag  = ShoppingBag;
  readonly Loader       = Loader;
  readonly AlertCircle  = AlertCircle;
  readonly Math         = Math;

  // ── Filtros y paginación ─────────────────────────────────────────────────
  searchQuery    = '';
  selectedStatus = 'Todos';
  currentPage    = 1;
  itemsPerPage   = 10;

  statuses = ['Todos', 'pendiente', 'confirmada', 'en_proceso', 'completada', 'cancelada'];

  // ── Estado ───────────────────────────────────────────────────────────────
  id_empresa: number | null = null;
  isLoading   = true;
  error:      string | null = null;

  orders: Order[] = [];

  constructor(
    private orderService: OrderService,
    private authService:  AuthService,
    private http:         HttpClient,
    private router:       Router,
  ) {}

  ngOnInit(): void {
    this.resolverEmpresa();
  }

  private resolverEmpresa(): void {
    const user = this.authService.getUser();
    if (!user) {
      this.error     = 'No se encontró la sesión.';
      this.isLoading = false;
      return;
    }

    this.http.get<any>(`${environment.apiUrl}/usuarios/${user.id}/empresa`).subscribe({
      next: (empresa) => {
        this.id_empresa = empresa.id_empresa;
        this.cargarOrdenes();
      },
      error: (err) => {
        this.error     = `No se encontró empresa (${err.status})`;
        this.isLoading = false;
      }
    });
  }

  cargarOrdenes(): void {
    if (!this.id_empresa) return;
    this.isLoading = true;
    this.error     = null;

    this.orderService.getByEmpresa(this.id_empresa).subscribe({
      next: (orders) => {
        this.orders    = orders;
        this.isLoading = false;
      },
      error: (err) => {
        this.error     = `Error al cargar pedidos (${err.status}: ${err.error?.error ?? err.message})`;
        this.isLoading = false;
      }
    });
  }

  // ── Filtros / paginación ─────────────────────────────────────────────────

  get filteredOrders(): Order[] {
    return this.orders.filter(o => {
      const matchesSearch = (o.usuario ?? '').toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            (o.email ?? '').toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            o.id_orden.toString().includes(this.searchQuery);
      const matchesStatus = this.selectedStatus === 'Todos' || o.estado_orden === this.selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }

  get paginatedOrders(): Order[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredOrders.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredOrders.length / this.itemsPerPage);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) this.currentPage = page;
  }

  onSearchChange(): void { this.currentPage = 1; }
  onStatusChange(): void { this.currentPage = 1; }

  // ── Helpers ───────────────────────────────────────────────────────────────

  formatFecha(fecha: string | null): string {
    if (!fecha) return '—';
    return new Date(fecha).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      pendiente:  'bg-yellow-100 text-yellow-700',
      confirmada: 'bg-blue-100 text-blue-700',
      en_proceso: 'bg-purple-100 text-purple-700',
      completada: 'bg-green-100 text-green-700',
      cancelada:  'bg-red-100 text-red-700'
    };
    return classes[status] ?? 'bg-gray-100 text-gray-600';
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      Todos:      'Todos',
      pendiente:  'Pendiente',
      confirmada: 'Confirmada',
      en_proceso: 'En proceso',
      completada: 'Completada',
      cancelada:  'Cancelada'
    };
    return labels[status] ?? status;
  }

  viewOrder(order: Order): void {
    this.router.navigate(['/dashboard/orders', order.id_orden]);
  }
}
