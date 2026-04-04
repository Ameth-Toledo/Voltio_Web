import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { LucideAngularModule, Plus, Upload, Image, AlertCircle } from 'lucide-angular';
import { Banner } from '../../models/Banner';
import { BannerCardComponent } from '../../components/banner-card/banner-card.component';
import { BannerComponent } from "../../../../shared/components/banner/banner.component";

@Component({
  selector: 'app-advertising',
  standalone: true,
  imports: [CommonModule, NavbarComponent, LucideAngularModule, BannerCardComponent, BannerComponent],
  templateUrl: './advertising.component.html',
  styleUrl: './advertising.component.css'
})
export class AdvertisingComponent {
  readonly Plus = Plus;
  readonly Upload = Upload;
  readonly Image = Image;
  readonly AlertCircle = AlertCircle;

  showUploadModal = false;
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  banners: Banner[] = [
    { id: 1, nombre: 'Banner ESP32 Promo', imagen_url: 'assets/banners/microcontroladores.png', activo: true, fecha_inicio: '2024-01-01', fecha_fin: '2024-03-31', clicks: 342, vistas: 4821 },
    { id: 2, nombre: 'Oferta Sensores', imagen_url: 'assets/banners/sensores.png', activo: false, fecha_inicio: '2024-02-01', fecha_fin: '2024-02-28', clicks: 128, vistas: 2103 },
    { id: 3, nombre: 'Kit Arduino Verano', imagen_url: 'assets/banners/kits.png', activo: true, fecha_inicio: '2024-03-01', fecha_fin: '2024-04-30', clicks: 89, vistas: 1540 },
  ];

  openUploadModal() {
    this.showUploadModal = true;
    this.selectedFile = null;
    this.previewUrl = null;
  }

  closeUploadModal() {
    this.showUploadModal = false;
    this.selectedFile = null;
    this.previewUrl = null;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    this.selectedFile = input.files[0];
    const reader = new FileReader();
    reader.onload = (e) => this.previewUrl = e.target?.result as string;
    reader.readAsDataURL(this.selectedFile);
  }

  toggleBanner(id: number) {
    const banner = this.banners.find(b => b.id === id);
    if (banner) banner.activo = !banner.activo;
  }

  deleteBanner(id: number) {
    this.banners = this.banners.filter(b => b.id !== id);
  }
}