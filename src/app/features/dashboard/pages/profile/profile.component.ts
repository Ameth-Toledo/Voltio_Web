import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import {
  LucideAngularModule, Camera, Phone, MapPin, Save, User, Store,
  Star, Package, ShoppingCart, Navigation, Loader, AlertCircle, CheckCircle
} from 'lucide-angular';
import { SafeUrlPipe } from '../../../../shared/pipes/safe-url.pipe';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../../auth/services/auth.service';
import { forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, NavbarComponent, LucideAngularModule, FormsModule, SafeUrlPipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  // ── Iconos ───────────────────────────────────────────────────────────────
  readonly Camera       = Camera;
  readonly Phone        = Phone;
  readonly MapPin       = MapPin;
  readonly Save         = Save;
  readonly User         = User;
  readonly Store        = Store;
  readonly Star         = Star;
  readonly Package      = Package;
  readonly ShoppingCart = ShoppingCart;
  readonly Navigation   = Navigation;
  readonly Loader       = Loader;
  readonly AlertCircle  = AlertCircle;
  readonly CheckCircle  = CheckCircle;

  // ── Estado ───────────────────────────────────────────────────────────────
  isLoading  = false;
  isSaving   = false;
  isEditing  = false;
  isLocating = false;
  error:      string | null = null;
  successMsg: string | null = null;

  userId: number | null = null;
  id_empresa: number | null = null;

  // ── Datos del perfil ──────────────────────────────────────────────────────
  profile = {
    name:          '',
    secondname:    '',
    lastname:      '',
    secondlastname:'',
    email:         '',
    phone:         '',
    address:       '',
    role:          'Vendedor',
    memberSince:   '',
    image_profile: 'assets/ameth.png',
    lat:           19.4326,
    lng:           -99.1332,
  };

  editProfile = { ...this.profile };

  // ── Stats ──────────────────────────────────────────────────────────────────
  productCount = 0;
  orderCount   = 0;

  // ── Imagen ────────────────────────────────────────────────────────────────
  imagenFile:   File | null = null;
  imagenPreview: string | null = null;

  // ── Autocompletar dirección ───────────────────────────────────────────────
  addressSuggestions: any[] = [];
  showSuggestions = false;

  constructor(
    private userService:    UserService,
    private authService:    AuthService,
    private productService: ProductService,
    private orderService:   OrderService,
    private http:           HttpClient,
  ) {}

  ngOnInit(): void {
    this.cargarDesdeLocalStorage();
    this.refrescarDesdeAPI();
  }

  /** Carga inmediata desde localStorage — sin esperar a la red */
  private cargarDesdeLocalStorage(): void {
    const stored = this.authService.getUser();
    if (!stored) return;
    this.userId  = stored.id;
    this.aplicarDatosUsuario(stored);
    this.isLoading = false;
    this.cargarStats(stored.id);
  }

  /** Refresca los datos del backend en segundo plano */
  private refrescarDesdeAPI(): void {
    this.userService.getProfile().subscribe({
      next: (user) => {
        this.userId = user.id;
        this.aplicarDatosUsuario(user);
        this.cargarStats(user.id);
      },
      error: () => { /* silencioso — ya tenemos los datos de localStorage */ }
    });
  }

  cargarPerfil(): void {
    this.cargarDesdeLocalStorage();
    this.refrescarDesdeAPI();
  }

  private aplicarDatosUsuario(user: { id: number; name: string; secondname?: string | null; lastname: string; secondlastname?: string | null; email: string; phone?: string | null; image_profile?: string | null; role: string; created_at: string }): void {
    this.profile = {
      name:           user.name           ?? '',
      secondname:     user.secondname     ?? '',
      lastname:       user.lastname       ?? '',
      secondlastname: user.secondlastname ?? '',
      email:          user.email          ?? '',
      phone:          user.phone          ?? '',
      address:        this.profile.address, // preservar si ya fue rellenado
      role:           this.roleLabel(user.role),
      memberSince:    this.formatFecha(user.created_at),
      image_profile:  user.image_profile  ?? '',
      lat:            this.profile.lat,
      lng:            this.profile.lng,
    };
    if (!this.isEditing) {
      this.editProfile = { ...this.profile };
    }
  }

  private cargarStats(userId: number): void {
    this.http.get<any>(`${environment.apiUrl}/usuarios/${userId}/empresa`).subscribe({
      next: (empresa) => {
        this.id_empresa = empresa.id_empresa;
        forkJoin({
          products: this.productService.getByEmpresa(empresa.id_empresa),
          orders:   this.orderService.getByEmpresa(empresa.id_empresa),
        }).subscribe({
          next: ({ products, orders }) => {
            this.productCount = products.length;
            this.orderCount   = orders.length;
          },
          error: () => {}
        });
      },
      error: () => {}
    });
  }

  // ── Editar ───────────────────────────────────────────────────────────────

  startEditing(): void {
    this.editProfile = { ...this.profile };
    this.imagenFile  = null;
    this.imagenPreview = null;
    this.isEditing   = true;
    this.successMsg  = null;
    this.error       = null;
  }

  cancelEditing(): void {
    this.editProfile   = { ...this.profile };
    this.imagenFile    = null;
    this.imagenPreview = null;
    this.isEditing     = false;
    this.showSuggestions = false;
  }

  onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.imagenFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => { this.imagenPreview = e.target?.result as string; };
      reader.readAsDataURL(this.imagenFile);
    }
  }

  saveProfile(): void {
    if (!this.userId || this.isSaving) return;
    this.isSaving = true;
    this.error    = null;

    this.userService.updateProfile(this.userId, {
      name:           this.editProfile.name,
      secondname:     this.editProfile.secondname || null,
      lastname:       this.editProfile.lastname,
      secondlastname: this.editProfile.secondlastname || null,
      email:          this.editProfile.email,
      phone:          this.editProfile.phone || null,
    }, this.imagenFile ?? undefined).subscribe({
      next: () => {
        this.profile   = { ...this.editProfile };
        if (this.imagenPreview) this.profile.image_profile = this.imagenPreview;
        this.isSaving  = false;
        this.isEditing = false;
        this.showSuggestions = false;
        this.successMsg = 'Perfil actualizado correctamente.';
        setTimeout(() => { this.successMsg = null; }, 4000);
      },
      error: (err) => {
        this.error    = err.error?.error ?? 'Error al guardar el perfil';
        this.isSaving = false;
      }
    });
  }

  // ── Mapa y dirección ──────────────────────────────────────────────────────

  get mapUrl(): string {
    const lat = this.profile.lat;
    const lng = this.profile.lng;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01},${lat - 0.01},${lng + 0.01},${lat + 0.01}&layer=mapnik&marker=${lat},${lng}`;
  }

  async searchAddress(query: string): Promise<void> {
    if (query.length < 3) { this.addressSuggestions = []; this.showSuggestions = false; return; }
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=mx&limit=5`,
        { headers: { 'Accept-Language': 'es' } }
      );
      const data = await response.json();
      this.addressSuggestions = data;
      this.showSuggestions    = data.length > 0;
    } catch { this.addressSuggestions = []; }
  }

  selectSuggestion(suggestion: any): void {
    this.editProfile.address = suggestion.display_name;
    this.editProfile.lat     = parseFloat(suggestion.lat);
    this.editProfile.lng     = parseFloat(suggestion.lon);
    this.showSuggestions     = false;
    this.addressSuggestions  = [];
  }

  detectLocation(): void {
    if (!navigator.geolocation) return;
    this.isLocating = true;
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
            { headers: { 'Accept-Language': 'es' } }
          );
          const data = await response.json();
          this.editProfile.address = data.display_name;
          this.editProfile.lat     = lat;
          this.editProfile.lng     = lng;
        } catch {
          this.editProfile.lat = lat;
          this.editProfile.lng = lng;
        }
        this.isLocating = false;
      },
      () => { this.isLocating = false; }
    );
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  get profileInitials(): string {
    const n = this.profile.name?.charAt(0) ?? '';
    const l = this.profile.lastname?.charAt(0) ?? '';
    return (n + l).toUpperCase() || '?';
  }

  private roleLabel(role: string): string {
    const map: Record<string, string> = {
      user:       'Vendedor',
      admin:      'Administrador',
      repartidor: 'Repartidor',
    };
    return map[role] ?? role;
  }

  private formatFecha(fecha: string): string {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-MX', { month: 'long', year: 'numeric' });
  }
}
