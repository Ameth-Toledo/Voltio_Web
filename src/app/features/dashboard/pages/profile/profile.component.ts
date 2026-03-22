import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { LucideAngularModule, Camera, Phone, MapPin, Save, User, Store, Star, Package, ShoppingCart, Navigation } from 'lucide-angular';
import { SafeUrlPipe } from '../../../../shared/pipes/safe-url.pipe';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, NavbarComponent, LucideAngularModule, FormsModule, SafeUrlPipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  readonly Camera = Camera;
  readonly Phone = Phone;
  readonly MapPin = MapPin;
  readonly Save = Save;
  readonly User = User;
  readonly Store = Store;
  readonly Star = Star;
  readonly Package = Package;
  readonly ShoppingCart = ShoppingCart;
  readonly Navigation = Navigation;

  isEditing = false;
  isLocating = false;
  addressSuggestions: any[] = [];
  showSuggestions = false;

  profile = {
    name: 'Ameth',
    secondname: 'de Jesus',
    lastname: 'Toledo',
    secondlastname: 'Mendez',
    email: 'ameth@voltio.mx',
    phone: '+52 961 123 4567',
    address: 'Tuxtla Gutiérrez, Chiapas, México',
    role: 'Vendedor',
    memberSince: 'Enero 2024',
    image_profile: 'assets/ameth.png',
    lat: 16.7516,
    lng: -93.1152
  };

  editProfile = { ...this.profile };

  get mapUrl(): string {
    return `https://www.openstreetmap.org/export/embed.html?bbox=${this.profile.lng - 0.01},${this.profile.lat - 0.01},${this.profile.lng + 0.01},${this.profile.lat + 0.01}&layer=mapnik&marker=${this.profile.lat},${this.profile.lng}`;
  }

  async searchAddress(query: string) {
    if (query.length < 3) {
      this.addressSuggestions = [];
      this.showSuggestions = false;
      return;
    }
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=mx&limit=5`,
        { headers: { 'Accept-Language': 'es' } }
      );
      const data = await response.json();
      this.addressSuggestions = data;
      this.showSuggestions = data.length > 0;
    } catch {
      this.addressSuggestions = [];
    }
  }

  selectSuggestion(suggestion: any) {
    this.editProfile.address = suggestion.display_name;
    this.editProfile.lat = parseFloat(suggestion.lat);
    this.editProfile.lng = parseFloat(suggestion.lon);
    this.showSuggestions = false;
    this.addressSuggestions = [];
  }

  detectLocation() {
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
          this.editProfile.lat = lat;
          this.editProfile.lng = lng;
        } catch {
          this.editProfile.lat = lat;
          this.editProfile.lng = lng;
        }
        this.isLocating = false;
      },
      () => { this.isLocating = false; }
    );
  }

  startEditing() {
    this.editProfile = { ...this.profile };
    this.isEditing = true;
  }

  saveProfile() {
    this.profile = { ...this.editProfile };
    this.isEditing = false;
    this.showSuggestions = false;
  }

  cancelEditing() {
    this.editProfile = { ...this.profile };
    this.isEditing = false;
    this.showSuggestions = false;
  }
}