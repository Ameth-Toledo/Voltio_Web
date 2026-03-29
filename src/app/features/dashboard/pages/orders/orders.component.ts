import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { LucideAngularModule, Search, Eye, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-angular';
import { Order } from '../../models/Order';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, NavbarComponent, LucideAngularModule, FormsModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent {
  readonly Search = Search;
  readonly Eye = Eye;
  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;
  readonly ShoppingBag = ShoppingBag;
  readonly Math = Math;

  searchQuery = '';
  selectedStatus = 'Todos';
  currentPage = 1;
  itemsPerPage = 10;

  constructor (private router: Router) {}

  statuses = ['Todos', 'pendiente', 'confirmada', 'en_proceso', 'completada', 'cancelada'];

  orders: Order[] = [
    { id_orden: 1001, id_usuario: 1, usuario: 'Carlos Méndez', fecha_orden: '2024-01-15', estado_orden: 'completada', monto_total: 540, direccion: 'Av. Reforma 123, CDMX', metodo_pago_tipo: 'tarjeta', metodo_pago_ultimos4: '4242' },
    { id_orden: 1002, id_usuario: 2, usuario: 'Ana López', fecha_orden: '2024-01-16', estado_orden: 'en_proceso', monto_total: 1200, direccion: 'Calle 5 de Mayo 45, Puebla', metodo_pago_tipo: 'tarjeta', metodo_pago_ultimos4: '1234' },
    { id_orden: 1003, id_usuario: 3, usuario: 'Luis Torres', fecha_orden: '2024-01-17', estado_orden: 'pendiente', monto_total: 89, direccion: 'Blvd. Kukulcán 78, Cancún', metodo_pago_tipo: 'efectivo' },
    { id_orden: 1004, id_usuario: 4, usuario: 'María García', fecha_orden: '2024-01-18', estado_orden: 'confirmada', monto_total: 630, direccion: 'Av. Juárez 210, Guadalajara', metodo_pago_tipo: 'tarjeta', metodo_pago_ultimos4: '5678' },
    { id_orden: 1005, id_usuario: 5, usuario: 'Pedro Ramírez', fecha_orden: '2024-01-19', estado_orden: 'cancelada', monto_total: 350, direccion: 'Calle Morelos 33, Monterrey', metodo_pago_tipo: 'efectivo' },
    { id_orden: 1006, id_usuario: 6, usuario: 'Sofía Hernández', fecha_orden: '2024-01-20', estado_orden: 'completada', monto_total: 1800, direccion: 'Av. Universidad 890, CDMX', metodo_pago_tipo: 'tarjeta', metodo_pago_ultimos4: '9999' },
    { id_orden: 1007, id_usuario: 7, usuario: 'Diego Flores', fecha_orden: '2024-01-21', estado_orden: 'pendiente', monto_total: 245, direccion: 'Paseo Montejo 12, Mérida', metodo_pago_tipo: 'tarjeta', metodo_pago_ultimos4: '3333' },
    { id_orden: 1008, id_usuario: 8, usuario: 'Valentina Cruz', fecha_orden: '2024-01-22', estado_orden: 'en_proceso', monto_total: 920, direccion: 'Calle Hidalgo 56, Oaxaca', metodo_pago_tipo: 'efectivo' },
    { id_orden: 1009, id_usuario: 9, usuario: 'Roberto Díaz', fecha_orden: '2024-01-23', estado_orden: 'confirmada', monto_total: 450, direccion: 'Av. Constitución 77, León', metodo_pago_tipo: 'tarjeta', metodo_pago_ultimos4: '7777' },
    { id_orden: 1010, id_usuario: 10, usuario: 'Isabella Moreno', fecha_orden: '2024-01-24', estado_orden: 'completada', monto_total: 2400, direccion: 'Blvd. López Mateos 321, Tijuana', metodo_pago_tipo: 'tarjeta', metodo_pago_ultimos4: '2222' },
  ];

  viewOrder(order: Order) {
    this.router.navigate(['/dashboard/orders', order.id_orden]);
  }

  get filteredOrders(): Order[] {
    return this.orders.filter(o => {
      const matchesSearch = (o.usuario ?? '').toLowerCase().includes(this.searchQuery.toLowerCase()) ||
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

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  onSearchChange() { this.currentPage = 1; }
  onStatusChange() { this.currentPage = 1; }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      pendiente: 'bg-yellow-100 text-yellow-700',
      confirmada: 'bg-blue-100 text-blue-700',
      en_proceso: 'bg-purple-100 text-purple-700',
      completada: 'bg-green-100 text-green-700',
      cancelada: 'bg-red-100 text-red-700'
    };
    return classes[status] ?? 'bg-gray-100 text-gray-600';
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      pendiente: 'Pendiente',
      confirmada: 'Confirmada',
      en_proceso: 'En proceso',
      completada: 'Completada',
      cancelada: 'Cancelada'
    };
    return labels[status] ?? status;
  }
}