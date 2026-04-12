import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import {
  LucideAngularModule, Plus, Search, Edit, Trash2, Eye, Package,
  ChevronLeft, ChevronRight, Loader, AlertCircle, CheckCircle, X, ImageOff
} from 'lucide-angular';
import { Product } from '../../models/Product';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { ProductService, Categoria } from '../../services/product.service';
import { AuthService } from '../../../auth/services/auth.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, NavbarComponent, LucideAngularModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {

  // ── Iconos ───────────────────────────────────────────────────────────────
  readonly Plus         = Plus;
  readonly Search       = Search;
  readonly Edit         = Edit;
  readonly Trash2       = Trash2;
  readonly Eye          = Eye;
  readonly Package      = Package;
  readonly ChevronLeft  = ChevronLeft;
  readonly ChevronRight = ChevronRight;
  readonly Loader       = Loader;
  readonly AlertCircle  = AlertCircle;
  readonly CheckCircle  = CheckCircle;
  readonly X            = X;
  readonly ImageOff     = ImageOff;
  readonly Math         = Math;

  // ── Filtros y paginación ─────────────────────────────────────────────────
  searchQuery         = '';
  selectedCategoriaId: number | null = null;
  currentPage         = 1;
  itemsPerPage        = 10;

  // ── Estado ───────────────────────────────────────────────────────────────
  id_empresa:  number | null = null;
  isLoading    = true;
  error:       string | null = null;
  successMsg:  string | null = null;

  products:   Product[]   = [];
  categorias: Categoria[] = [];

  // ── Modal crear / editar ─────────────────────────────────────────────────
  showModal       = false;
  editingProduct: Product | null = null;
  isSaving        = false;
  errorModal:     string | null = null;
  imagenPreview:  string | null = null;

  form = {
    nombre:       '',
    sku:          '',
    descripcion:  '',
    precio_venta: null as number | null,
    stock_actual: null as number | null,
    id_categoria: null as number | null,
  };
  imagenFile: File | null = null;

  // ── Eliminar ──────────────────────────────────────────────────────────────
  deletingId: number | null = null;

  constructor(
    private productService: ProductService,
    private authService:    AuthService,
    private http:           HttpClient,
    public router:          Router,
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
        this.cargarDatos();
      },
      error: (err) => {
        this.error     = `No se encontró empresa (${err.status})`;
        this.isLoading = false;
      }
    });
  }

  cargarDatos(): void {
    if (!this.id_empresa) return;
    this.isLoading = true;
    this.error     = null;

    forkJoin({
      products:   this.productService.getByEmpresa(this.id_empresa),
      categorias: this.productService.getCategorias(),
    }).subscribe({
      next: ({ products, categorias }) => {
        this.products   = products;
        this.categorias = categorias;
        this.isLoading  = false;
      },
      error: (err) => {
        this.error     = `Error al cargar productos (${err.status}: ${err.error?.error ?? err.message})`;
        this.isLoading = false;
      }
    });
  }

  // ── Filtros / paginación ─────────────────────────────────────────────────

  get filteredProducts(): Product[] {
    return this.products.filter(p => {
      const matchesSearch = p.nombre.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            p.sku.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesCat    = this.selectedCategoriaId === null || p.id_categoria === this.selectedCategoriaId;
      return matchesSearch && matchesCat;
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

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) this.currentPage = page;
  }

  onSearchChange():   void { this.currentPage = 1; }
  onCategoryChange(): void { this.currentPage = 1; }

  // ── Helpers visuales ─────────────────────────────────────────────────────

  getCategoriaName(id: number | null | undefined): string {
    if (!id) return '—';
    return this.categorias.find(c => c.id_categoria === id)?.nombre_categoria ?? `Cat. ${id}`;
  }

  getStockClass(stock: number): string {
    if (stock === 0)  return 'bg-red-100 text-red-600';
    if (stock <= 10)  return 'bg-yellow-100 text-yellow-600';
    return 'bg-green-100 text-green-600';
  }

  getStockLabel(stock: number): string {
    if (stock === 0)  return 'Sin stock';
    if (stock <= 10)  return 'Stock bajo';
    return 'En stock';
  }

  formatFecha(fecha: any): string {
    if (!fecha) return '—';
    return new Date(fecha).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  viewProduct(product: Product): void {
    this.router.navigate(['/dashboard/products', product.id_producto]);
  }

  // ── Modal crear / editar ─────────────────────────────────────────────────

  abrirModal(product?: Product): void {
    this.editingProduct = product ?? null;
    this.errorModal     = null;
    this.imagenFile     = null;
    this.imagenPreview  = null;

    if (product) {
      this.form = {
        nombre:       product.nombre,
        sku:          product.sku,
        descripcion:  product.descripcion ?? '',
        precio_venta: product.precio_venta,
        stock_actual: product.stock_actual,
        id_categoria: product.id_categoria ?? null,
      };
      this.imagenPreview = product.imagen_url ?? null;
    } else {
      this.form = { nombre: '', sku: '', descripcion: '', precio_venta: null, stock_actual: null, id_categoria: null };
    }
    this.showModal = true;
  }

  cerrarModal(): void {
    this.showModal      = false;
    this.editingProduct = null;
    this.errorModal     = null;
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.imagenFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => { this.imagenPreview = e.target?.result as string; };
      reader.readAsDataURL(this.imagenFile);
    }
  }

  guardarProducto(): void {
    if (!this.id_empresa || this.isSaving) return;

    if (!this.form.nombre.trim() || !this.form.sku.trim() || !this.form.precio_venta) {
      this.errorModal = 'Nombre, SKU y precio son obligatorios';
      return;
    }

    const fd = new FormData();
    fd.append('nombre',       this.form.nombre.trim());
    fd.append('sku',          this.form.sku.trim());
    fd.append('descripcion',  this.form.descripcion.trim());
    fd.append('precio_venta', String(this.form.precio_venta));
    fd.append('stock_actual', String(this.form.stock_actual ?? 0));
    fd.append('id_empresa',   String(this.id_empresa));
    if (this.form.id_categoria) fd.append('id_categoria', String(this.form.id_categoria));
    if (this.imagenFile)        fd.append('imagen', this.imagenFile);

    this.isSaving   = true;
    this.errorModal = null;

    const req$ = this.editingProduct
      ? this.productService.update(this.editingProduct.id_producto, fd)
      : this.productService.create(fd);

    req$.subscribe({
      next: () => {
        this.isSaving   = false;
        this.successMsg = this.editingProduct ? 'Producto actualizado.' : 'Producto creado.';
        this.cerrarModal();
        this.cargarDatos();
        setTimeout(() => { this.successMsg = null; }, 4000);
      },
      error: (err) => {
        this.errorModal = err.error?.error ?? 'Error al guardar el producto';
        this.isSaving   = false;
      }
    });
  }

  // ── Eliminar ──────────────────────────────────────────────────────────────

  eliminarProducto(product: Product): void {
    if (!confirm(`¿Eliminar "${product.nombre}"? Esta acción no se puede deshacer.`)) return;
    this.deletingId = product.id_producto;

    this.productService.delete(product.id_producto).subscribe({
      next: () => {
        this.deletingId = null;
        this.successMsg = `"${product.nombre}" eliminado.`;
        this.cargarDatos();
        setTimeout(() => { this.successMsg = null; }, 4000);
      },
      error: (err) => {
        this.deletingId = null;
        this.error = err.error?.error ?? 'Error al eliminar el producto';
      }
    });
  }
}
