import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { LucideAngularModule, ArrowLeft, Edit, Trash2, Package, Tag, BarChart2, Star, ChevronRight } from 'lucide-angular';
import { Product } from '../../models/Product';
import { Specification } from '../../models/Specification';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, NavbarComponent, LucideAngularModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  readonly ArrowLeft = ArrowLeft;
  readonly Edit = Edit;
  readonly Trash2 = Trash2;
  readonly Package = Package;
  readonly Tag = Tag;
  readonly BarChart2 = BarChart2;
  readonly Star = Star;
  readonly ChevronRight = ChevronRight;

  product: Product | null = null;

  private mockProducts: Product[] = [
    {
      id_producto: 1,
      sku: 'MCU-001',
      nombre: 'ESP32 DevKit v1',
      descripcion: 'Módulo de desarrollo basado en el chip ESP32 de Espressif. Incluye WiFi y Bluetooth integrados, ideal para proyectos IoT.',
      precio_venta: 120,
      stock_actual: 45,
      imagen_url: 'assets/hardware/esp32.webp',
      categoria: 'Microcontroladores',
      fecha_registro: '2024-01-15',
      especificaciones: [
        { clave: 'Procesador', valor: 'Xtensa LX6 dual-core 240MHz' },
        { clave: 'RAM', valor: '520 KB SRAM' },
        { clave: 'Flash', valor: '4 MB' },
        { clave: 'WiFi', valor: '802.11 b/g/n' },
        { clave: 'Bluetooth', valor: 'BT 4.2 + BLE' },
        { clave: 'GPIO', valor: '38 pines' },
        { clave: 'Voltaje', valor: '3.3V / 5V' },
      ]
    },
    {
      id_producto: 2,
      sku: 'MCU-002',
      nombre: 'Arduino Uno R3',
      descripcion: 'Placa de desarrollo Arduino basada en el microcontrolador ATmega328P.',
      precio_venta: 180,
      stock_actual: 32,
      imagen_url: 'assets/hardware/arduino.webp',
      categoria: 'Microcontroladores',
      fecha_registro: '2024-01-16',
      especificaciones: [
        { clave: 'Microcontrolador', valor: 'ATmega328P' },
        { clave: 'Velocidad', valor: '16 MHz' },
        { clave: 'Flash', valor: '32 KB' },
        { clave: 'SRAM', valor: '2 KB' },
        { clave: 'Pines digitales', valor: '14' },
        { clave: 'Pines analógicos', valor: '6' },
        { clave: 'Voltaje', valor: '5V' },
      ]
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.product = this.mockProducts.find(p =>
      p.nombre.toLowerCase().replace(/\s+/g, '-') === id
    ) ?? this.mockProducts[0];
  }

  goBack() {
    this.router.navigate(['/dashboard/products']);
  }

  getStockClass(): string {
    if (!this.product) return '';
    if (this.product.stock_actual === 0) return 'bg-red-100 text-red-600';
    if (this.product.stock_actual <= 10) return 'bg-yellow-100 text-yellow-600';
    return 'bg-green-100 text-green-600';
  }

  getStockLabel(): string {
    if (!this.product) return '';
    if (this.product.stock_actual === 0) return 'Sin stock';
    if (this.product.stock_actual <= 10) return 'Stock bajo';
    return 'En stock';
  }
}