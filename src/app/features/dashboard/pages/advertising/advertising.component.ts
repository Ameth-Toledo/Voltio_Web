import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import {
  LucideAngularModule, Plus, Upload, ImageOff, AlertCircle, Loader, CheckCircle
} from 'lucide-angular';
import { Banner } from '../../models/Banner';
import { BannerCardComponent } from '../../components/banner-card/banner-card.component';
import { BannerComponent } from '../../../../shared/components/banner/banner.component';
import { BannerService } from '../../services/banner.service';
import { AuthService } from '../../../auth/services/auth.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-advertising',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, LucideAngularModule, BannerCardComponent, BannerComponent],
  templateUrl: './advertising.component.html',
  styleUrl: './advertising.component.css'
})
export class AdvertisingComponent implements OnInit {
  readonly Plus         = Plus;
  readonly Upload       = Upload;
  readonly ImageOff     = ImageOff;
  readonly AlertCircle  = AlertCircle;
  readonly Loader       = Loader;
  readonly CheckCircle  = CheckCircle;

  // ── Estado ───────────────────────────────────────────────────────────────
  isLoading   = false;
  isSaving    = false;
  error:       string | null = null;
  successMsg:  string | null = null;

  id_empresa: number | null = null;

  // ── Banners ───────────────────────────────────────────────────────────────
  banners: Banner[] = [];

  // ── Modal ─────────────────────────────────────────────────────────────────
  showUploadModal = false;
  selectedFile: File | null = null;
  previewUrl:   string | null = null;

  form = {
    nombre:       '',
    fecha_inicio: '',
    fecha_fin:    '',
  };

  constructor(
    private bannerService: BannerService,
    private authService:   AuthService,
    private http:          HttpClient,
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (!user) return;

    this.http.get<any>(`${environment.apiUrl}/usuarios/${user.id}/empresa`).subscribe({
      next: (empresa) => {
        this.id_empresa = empresa.id_empresa;
        this.cargarBanners();
      },
      error: () => {
        this.error = 'No se encontró tu empresa. Por favor completa tu perfil primero.';
      }
    });
  }

  private cargarBanners(): void {
    if (!this.id_empresa) return;
    this.isLoading = true;
    this.bannerService.getByEmpresa(this.id_empresa).subscribe({
      next:  (data) => { this.banners = data; this.isLoading = false; },
      error: () => { this.error = 'Error al cargar los banners'; this.isLoading = false; }
    });
  }

  // ── Modal ─────────────────────────────────────────────────────────────────

  openUploadModal(): void {
    this.showUploadModal = true;
    this.selectedFile    = null;
    this.previewUrl      = null;
    this.form            = { nombre: '', fecha_inicio: '', fecha_fin: '' };
    this.error           = null;
  }

  closeUploadModal(): void {
    this.showUploadModal = false;
    this.selectedFile    = null;
    this.previewUrl      = null;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    this.selectedFile = input.files[0];
    const reader = new FileReader();
    reader.onload = (e) => this.previewUrl = e.target?.result as string;
    reader.readAsDataURL(this.selectedFile);
  }

  subirBanner(): void {
    if (!this.selectedFile || !this.id_empresa || this.isSaving) return;
    if (!this.form.nombre || !this.form.fecha_inicio || !this.form.fecha_fin) {
      this.error = 'Completa todos los campos antes de subir';
      return;
    }

    this.isSaving = true;
    this.error    = null;

    const formData = new FormData();
    formData.append('imagen',       this.selectedFile);
    formData.append('id_empresa',   String(this.id_empresa));
    formData.append('nombre',       this.form.nombre);
    formData.append('fecha_inicio', this.form.fecha_inicio);
    formData.append('fecha_fin',    this.form.fecha_fin);
    formData.append('activo',       'true');

    this.bannerService.create(formData).subscribe({
      next: (banner) => {
        this.banners.unshift(banner);
        this.isSaving       = false;
        this.showUploadModal = false;
        this.successMsg     = 'Banner subido correctamente.';
        setTimeout(() => { this.successMsg = null; }, 4000);
      },
      error: (err) => {
        this.error    = err.error?.error ?? 'Error al subir el banner';
        this.isSaving = false;
      }
    });
  }

  // ── Acciones sobre banners ────────────────────────────────────────────────

  toggleBanner(id: number): void {
    const banner = this.banners.find(b => b.id === id);
    if (!banner) return;
    const nuevoEstado = !banner.activo;
    this.bannerService.toggle(id, nuevoEstado).subscribe({
      next: (updated) => {
        const idx = this.banners.findIndex(b => b.id === id);
        if (idx !== -1) this.banners[idx] = updated;
      },
      error: () => { this.error = 'Error al cambiar el estado del banner'; }
    });
  }

  deleteBanner(id: number): void {
    this.bannerService.delete(id).subscribe({
      next: () => {
        this.banners = this.banners.filter(b => b.id !== id);
        this.successMsg = 'Banner eliminado.';
        setTimeout(() => { this.successMsg = null; }, 3000);
      },
      error: () => { this.error = 'Error al eliminar el banner'; }
    });
  }
}
