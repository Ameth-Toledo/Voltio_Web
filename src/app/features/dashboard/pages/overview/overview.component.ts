import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import {
  LucideAngularModule, Plus, Star, TrendingUp, Package, ShoppingCart, Loader
} from 'lucide-angular';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductCard } from '../../models/ProductCard';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, LucideAngularModule, ProductCardComponent],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css'
})
export class OverviewComponent implements OnInit {

  readonly Plus         = Plus;
  readonly Star         = Star;
  readonly TrendingUp   = TrendingUp;
  readonly Package      = Package;
  readonly ShoppingCart = ShoppingCart;
  readonly Loader       = Loader;

  // ── Estado ───────────────────────────────────────────────────────────────
  isLoading   = true;
  id_empresa: number | null = null;

  // ── Stats ─────────────────────────────────────────────────────────────────
  userName      = '';
  userPhoto     = '';
  productCount  = 0;
  orderCount   = 0;
  totalVentas  = 0;

  // ── Productos recientes (cards) ───────────────────────────────────────────
  productCards: ProductCard[] = [];

  constructor(
    private authService:    AuthService,
    private productService: ProductService,
    private orderService:   OrderService,
    private http:           HttpClient,
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user) {
      this.userName  = user.name;
      this.userPhoto = user.image_profile ?? '';
    }
    this.resolverEmpresa();
  }

  private resolverEmpresa(): void {
    const user = this.authService.getUser();
    if (!user) { this.isLoading = false; return; }

    this.http.get<any>(`${environment.apiUrl}/usuarios/${user.id}/empresa`).subscribe({
      next: (empresa) => {
        this.id_empresa = empresa.id_empresa;
        this.cargarDatos();
      },
      error: () => { this.isLoading = false; }
    });
  }

  private cargarDatos(): void {
    if (!this.id_empresa) { this.isLoading = false; return; }

    forkJoin({
      products: this.productService.getByEmpresa(this.id_empresa),
      orders:   this.orderService.getByEmpresa(this.id_empresa),
    }).subscribe({
      next: ({ products, orders }) => {
        this.productCount = products.length;
        this.orderCount   = orders.length;
        this.totalVentas  = orders
          .filter(o => o.estado_orden === 'completada')
          .reduce((sum, o) => sum + o.monto_total, 0);

        // Últimos 8 productos como cards
        this.productCards = products.slice(0, 8).map(p => ({
          productId: p.id_producto,
          imgSrc:    p.imagen_url ?? '',
          name:      p.nombre,
          category:  p.categoria ?? '',
          rating:    p.stock_actual > 0 ? `${p.stock_actual} en stock` : 'Sin stock',
        }));

        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  formatVentas(): string {
    if (this.totalVentas >= 1000) {
      return `$${(this.totalVentas / 1000).toFixed(1)}K`;
    }
    return `$${this.totalVentas.toFixed(0)}`;
  }
}
