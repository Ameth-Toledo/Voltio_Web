import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { LucideAngularModule, User, Lock, MapPin, Bell, Eye, EyeOff, Plus, Trash2, Check } from 'lucide-angular';
import { Address } from '../../models/Address';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, NavbarComponent, LucideAngularModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  readonly User = User;
  readonly Lock = Lock;
  readonly MapPin = MapPin;
  readonly Bell = Bell;
  readonly Eye = Eye;
  readonly EyeOff = EyeOff;
  readonly Plus = Plus;
  readonly Trash2 = Trash2;
  readonly Check = Check;

  activeSection = 'cuenta';

  sections = [
    { id: 'cuenta', label: 'Cuenta', icon: User },
    { id: 'seguridad', label: 'Seguridad', icon: Lock },
    { id: 'direcciones', label: 'Direcciones', icon: MapPin },
    { id: 'notificaciones', label: 'Notificaciones', icon: Bell },
  ];

  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  savedAccount = false;
  savedPassword = false;
  showAddressForm = false;

  account = {
    email: 'ameth@voltio.mx',
    phone: '+52 961 123 4567'
  };

  password = {
    current: '',
    new: '',
    confirm: ''
  };

  notifications: Record<string, boolean> = {
    pedido_nuevo: true,
    pedido_confirmado: true,
    pedido_cancelado: true,
    stock_bajo: true,
    promociones: false,
  };

  notificationList = [
    { key: 'pedido_nuevo', label: 'Pedido nuevo', description: 'Cuando recibas un nuevo pedido' },
    { key: 'pedido_confirmado', label: 'Pedido confirmado', description: 'Cuando un pedido sea confirmado' },
    { key: 'pedido_cancelado', label: 'Pedido cancelado', description: 'Cuando un pedido sea cancelado' },
    { key: 'stock_bajo', label: 'Stock bajo', description: 'Cuando un producto tenga poco stock' },
    { key: 'promociones', label: 'Promociones', description: 'Ofertas y novedades de Voltio' },
  ];

  addresses: Address[] = [
    { id: 1, alias: 'Casa', direccion: 'Av. Central 123, Tuxtla Gutiérrez, Chiapas', es_predeterminada: true },
    { id: 2, alias: 'Oficina', direccion: 'Blvd. Belisario Domínguez 456, Tuxtla Gutiérrez, Chiapas', es_predeterminada: false },
  ];

  newAddress = { alias: '', direccion: '' };

  toggleNotification(key: string) {
    this.notifications[key] = !this.notifications[key];
  }

  saveAccount() {
    this.savedAccount = true;
    setTimeout(() => this.savedAccount = false, 2000);
  }

  savePassword() {
    if (this.password.new !== this.password.confirm) return;
    this.password = { current: '', new: '', confirm: '' };
    this.savedPassword = true;
    setTimeout(() => this.savedPassword = false, 2000);
  }

  setDefault(id: number) {
    this.addresses = this.addresses.map(a => ({ ...a, es_predeterminada: a.id === id }));
  }

  deleteAddress(id: number) {
    this.addresses = this.addresses.filter(a => a.id !== id);
  }

  addAddress() {
    if (!this.newAddress.alias || !this.newAddress.direccion) return;
    this.addresses.push({
      id: Date.now(),
      alias: this.newAddress.alias,
      direccion: this.newAddress.direccion,
      es_predeterminada: this.addresses.length === 0
    });
    this.newAddress = { alias: '', direccion: '' };
    this.showAddressForm = false;
  }
}