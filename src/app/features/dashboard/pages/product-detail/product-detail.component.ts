import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import {
  LucideAngularModule, Edit, Trash2, ChevronRight, Loader, AlertCircle
} from 'lucide-angular';
import { Product } from '../../models/Product';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, NavbarComponent, LucideAngularModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  readonly Edit         = Edit;
  readonly Trash2       = Trash2;
  readonly ChevronRight = ChevronRight;
  readonly Loader       = Loader;
  readonly AlertCircle  = AlertCircle;

  product:   Product | null = null;
  isLoading  = true;
  error:     string | null = null;

  constructor(
    private route:          ActivatedRoute,
    private router:         Router,
    private productService: ProductService,
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id      = Number(idParam);

    if (!id || isNaN(id)) {
      this.error     = 'ID de producto inválido';
      this.isLoading = false;
      return;
    }

    this.productService.getById(id).subscribe({
      next:  (p)   => { this.product = p; this.isLoading = false; },
      error: ()    => { this.error = 'No se encontró el producto'; this.isLoading = false; }
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard/products']);
  }

  getStockClass(): string {
    if (!this.product) return '';
    if (this.product.stock_actual === 0)   return 'bg-red-100 text-red-600';
    if (this.product.stock_actual <= 10)   return 'bg-yellow-100 text-yellow-600';
    return 'bg-green-100 text-green-600';
  }

  getStockLabel(): string {
    if (!this.product) return '';
    if (this.product.stock_actual === 0)   return 'Sin stock';
    if (this.product.stock_actual <= 10)   return 'Stock bajo';
    return 'En stock';
  }

  formatFecha(fecha: string): string {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}
