import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { LucideAngularModule, ChevronRight, MapPin, CreditCard, User, Clock } from 'lucide-angular';
import { Order, OrderDetail } from '../../models/Order';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, NavbarComponent, LucideAngularModule],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.css'
})
export class OrderDetailComponent implements OnInit {
  readonly ChevronRight = ChevronRight;
  readonly MapPin = MapPin;
  readonly CreditCard = CreditCard;
  readonly User = User;
  readonly Clock = Clock;

  order: Order | null = null;

  private mockOrders: Order[] = [
    {
      id_orden: 1001,
      id_usuario: 1,
      usuario: 'Carlos Méndez',
      email: 'carlos@example.com',
      fecha_orden: '2024-01-15',
      estado_orden: 'completada',
      monto_total: 540,
      descripcion: 'Pedido de componentes electrónicos',
      direccion: 'Av. Reforma 123, CDMX',
      metodo_pago_tipo: 'tarjeta',
      metodo_pago_ultimos4: '4242',
      detalles: [
        { id_detalle: 1, id_orden: 1001, id_producto: 1, nombre_producto: 'ESP32 DevKit v1', imagen_url: 'assets/hardware/esp32.webp', cantidad: 2, precio_unitario: 120, subtotal: 240 },
        { id_detalle: 2, id_orden: 1001, id_producto: 2, nombre_producto: 'Arduino Uno R3', imagen_url: 'assets/hardware/arduino.webp', cantidad: 1, precio_unitario: 180, subtotal: 180 },
        { id_detalle: 3, id_orden: 1001, id_producto: 5, nombre_producto: 'Kit Resistencias 1/4W 600pz', imagen_url: 'assets/hardware/capacitor.webp', cantidad: 1, precio_unitario: 89, subtotal: 89 },
      ]
    },
    {
      id_orden: 1002,
      id_usuario: 2,
      usuario: 'Ana López',
      email: 'ana@example.com',
      fecha_orden: '2024-01-16',
      estado_orden: 'en_proceso',
      monto_total: 1200,
      descripcion: 'Kit de robótica',
      direccion: 'Calle 5 de Mayo 45, Puebla',
      metodo_pago_tipo: 'tarjeta',
      metodo_pago_ultimos4: '1234',
      detalles: [
        { id_detalle: 4, id_orden: 1002, id_producto: 11, nombre_producto: 'Brazo Robótico 4DOF Kit', imagen_url: 'assets/hardware/esp32.webp', cantidad: 1, precio_unitario: 1200, subtotal: 1200 },
      ]
    },
    {
      id_orden: 1003,
      id_usuario: 3,
      usuario: 'Luis Torres',
      email: 'luis@example.com',
      fecha_orden: '2024-01-17',
      estado_orden: 'pendiente',
      monto_total: 89,
      descripcion: 'Componentes pasivos',
      direccion: 'Blvd. Kukulcán 78, Cancún',
      metodo_pago_tipo: 'efectivo',
      detalles: [
        { id_detalle: 5, id_orden: 1003, id_producto: 5, nombre_producto: 'Kit Resistencias 1/4W 600pz', imagen_url: 'assets/hardware/capacitor.webp', cantidad: 1, precio_unitario: 89, subtotal: 89 },
      ]
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.order = this.mockOrders.find(o => o.id_orden === id) ?? this.mockOrders[0];
  }

  goBack() {
    this.router.navigate(['/dashboard/orders']);
  }

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