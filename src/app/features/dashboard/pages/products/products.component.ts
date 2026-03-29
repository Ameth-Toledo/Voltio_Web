import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { LucideAngularModule, Plus, Search, Edit, Trash2, Eye, Package, ChevronLeft, ChevronRight } from 'lucide-angular';
import { Product } from '../../models/Product';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, NavbarComponent, LucideAngularModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
  readonly Plus = Plus;
  readonly Search = Search;
  readonly Edit = Edit;
  readonly Trash2 = Trash2;
  readonly Eye = Eye;
  readonly Package = Package;
  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;
  readonly Math = Math;

  searchQuery = '';
  selectedCategory = 'Todos';
  currentPage = 1;
  itemsPerPage = 10;

  constructor (private router: Router) {}

  categories = ['Todos', 'Microcontroladores', 'Sensores', 'Componentes', 'Herramientas y Equipos', 'Kits de Desarrollo', 'Robótica'];

  products: Product[] = [
    { id_producto: 1, sku: 'MCU-001', nombre: 'ESP32 DevKit v1', categoria: 'Microcontroladores', precio_venta: 120, stock_actual: 45, imagen_url: 'assets/hardware/esp32.webp', fecha_registro: '2024-01-15' },
    { id_producto: 2, sku: 'MCU-002', nombre: 'Arduino Uno R3', categoria: 'Microcontroladores', precio_venta: 180, stock_actual: 32, imagen_url: 'assets/hardware/arduino.webp', fecha_registro: '2024-01-16' },
    { id_producto: 3, sku: 'SEN-001', nombre: 'Sensor DHT22 Temperatura y Humedad', categoria: 'Sensores', precio_venta: 65, stock_actual: 80, imagen_url: 'assets/hardware/esp32.webp', fecha_registro: '2024-01-17' },
    { id_producto: 4, sku: 'SEN-002', nombre: 'Sensor Ultrasónico HC-SR04', categoria: 'Sensores', precio_venta: 45, stock_actual: 0, imagen_url: 'assets/hardware/esp32.webp', fecha_registro: '2024-01-18' },
    { id_producto: 5, sku: 'CMP-001', nombre: 'Kit Resistencias 1/4W 600pz', categoria: 'Componentes', precio_venta: 89, stock_actual: 25, imagen_url: 'assets/hardware/capacitor.webp', fecha_registro: '2024-01-19' },
    { id_producto: 6, sku: 'CMP-002', nombre: 'Capacitores Electrolíticos Kit 200pz', categoria: 'Componentes', precio_venta: 75, stock_actual: 40, imagen_url: 'assets/hardware/capacitor.webp', fecha_registro: '2024-01-19' },
    { id_producto: 7, sku: 'HRR-001', nombre: 'Soldador Temperatura Variable 60W', categoria: 'Herramientas y Equipos', precio_venta: 350, stock_actual: 18, imagen_url: 'assets/hardware/cautin.webp', fecha_registro: '2024-01-20' },
    { id_producto: 8, sku: 'HRR-002', nombre: 'Multímetro Digital DT830B', categoria: 'Herramientas y Equipos', precio_venta: 220, stock_actual: 30, imagen_url: 'assets/hardware/cautin.webp', fecha_registro: '2024-01-20' },
    { id_producto: 9, sku: 'KIT-001', nombre: 'Kit Iniciador Arduino Completo', categoria: 'Kits de Desarrollo', precio_venta: 450, stock_actual: 5, imagen_url: 'assets/hardware/esp32.webp', fecha_registro: '2024-01-21' },
    { id_producto: 10, sku: 'KIT-002', nombre: 'Kit IoT ESP32 con Sensores', categoria: 'Kits de Desarrollo', precio_venta: 380, stock_actual: 22, imagen_url: 'assets/hardware/esp32.webp', fecha_registro: '2024-01-21' },
    { id_producto: 11, sku: 'ROB-001', nombre: 'Brazo Robótico 4DOF Kit', categoria: 'Robótica', precio_venta: 1200, stock_actual: 8, imagen_url: 'assets/hardware/esp32.webp', fecha_registro: '2024-01-22' },
    { id_producto: 12, sku: 'ROB-002', nombre: 'Servo Motor SG90 Pack 5pz', categoria: 'Robótica', precio_venta: 95, stock_actual: 0, imagen_url: 'assets/hardware/esp32.webp', fecha_registro: '2024-01-22' },
  ];

  viewProduct(product: Product) {
    this.router.navigate(['/dashboard/products', product.nombre.toLowerCase().replace(/\s+/g, '-')]);
  }
  
  get filteredProducts(): Product[] {
    return this.products.filter(p => {
      const matchesSearch = p.nombre.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                           p.sku.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesCategory = this.selectedCategory === 'Todos' || p.categoria === this.selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }

  get paginatedProducts(): Product[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredProducts.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  onSearchChange() {
    this.currentPage = 1;
  }

  onCategoryChange() {
    this.currentPage = 1;
  }

  getStockClass(stock: number): string {
    if (stock === 0) return 'bg-red-100 text-red-600';
    if (stock <= 10) return 'bg-yellow-100 text-yellow-600';
    return 'bg-green-100 text-green-600';
  }

  getStockLabel(stock: number): string {
    if (stock === 0) return 'Sin stock';
    if (stock <= 10) return 'Stock bajo';
    return 'En stock';
  }
}