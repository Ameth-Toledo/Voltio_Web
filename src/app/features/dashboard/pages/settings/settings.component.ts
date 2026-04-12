import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import {
  LucideAngularModule, User, Lock, MapPin, Bell, Eye, EyeOff,
  Plus, Trash2, Check, Loader, AlertCircle, CheckCircle
} from 'lucide-angular';
import { Address } from '../../models/Address';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../../auth/services/auth.service';

const NOTIF_KEY = (id: number) => `voltio_notifications_${id}`;

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, NavbarComponent, LucideAngularModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {

  // ── Iconos ───────────────────────────────────────────────────────────────
  readonly User         = User;
  readonly Lock         = Lock;
  readonly MapPin       = MapPin;
  readonly Bell         = Bell;
  readonly Eye          = Eye;
  readonly EyeOff       = EyeOff;
  readonly Plus         = Plus;
  readonly Trash2       = Trash2;
  readonly Check        = Check;
  readonly Loader       = Loader;
  readonly AlertCircle  = AlertCircle;
  readonly CheckCircle  = CheckCircle;

  activeSection = 'cuenta';

  sections = [
    { id: 'cuenta',         label: 'Cuenta',         icon: User },
    { id: 'seguridad',      label: 'Seguridad',      icon: Lock },
    { id: 'direcciones',    label: 'Direcciones',     icon: MapPin },
    { id: 'notificaciones', label: 'Notificaciones',  icon: Bell },
  ];

  // ── Cuenta ────────────────────────────────────────────────────────────────
  userId: number | null = null;

  account = { email: '', phone: '' };

  isSavingAccount = false;
  accountError:   string | null = null;
  accountSuccess: string | null = null;

  // ── Seguridad (contraseña) ────────────────────────────────────────────────
  showCurrentPassword = false;
  showNewPassword     = false;
  showConfirmPassword = false;

  password = { current: '', new: '', confirm: '' };

  isSavingPassword = false;
  passwordError:   string | null = null;
  passwordSuccess: string | null = null;

  // ── Notificaciones (localStorage) ─────────────────────────────────────────
  notifications: Record<string, boolean> = {
    pedido_nuevo:      true,
    pedido_confirmado: true,
    pedido_cancelado:  true,
    stock_bajo:        true,
    promociones:       false,
  };

  notificationList = [
    { key: 'pedido_nuevo',      label: 'Pedido nuevo',       description: 'Cuando recibas un nuevo pedido' },
    { key: 'pedido_confirmado', label: 'Pedido confirmado',  description: 'Cuando un pedido sea confirmado' },
    { key: 'pedido_cancelado',  label: 'Pedido cancelado',   description: 'Cuando un pedido sea cancelado' },
    { key: 'stock_bajo',        label: 'Stock bajo',         description: 'Cuando un producto tenga poco stock' },
    { key: 'promociones',       label: 'Promociones',        description: 'Ofertas y novedades de Voltio' },
  ];

  notifSaved = false;

  // ── Direcciones ───────────────────────────────────────────────────────────
  showAddressForm = false;
  addresses: Address[] = [];
  newAddress = { alias: '', direccion: '' };

  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user) {
      this.userId      = user.id;
      this.account     = { email: user.email, phone: user.phone ?? '' };
      this.loadNotifications(user.id);
    }
  }

  // ── Cuenta ────────────────────────────────────────────────────────────────

  saveAccount(): void {
    if (!this.userId || this.isSavingAccount) return;
    const user = this.authService.getUser();
    if (!user) return;

    this.isSavingAccount = true;
    this.accountError    = null;
    this.accountSuccess  = null;

    this.userService.updateProfile(this.userId, {
      name:           user.name,
      secondname:     user.secondname,
      lastname:       user.lastname,
      secondlastname: user.secondlastname,
      email:          this.account.email,
      phone:          this.account.phone || null,
    }).subscribe({
      next: () => {
        this.isSavingAccount = false;
        this.accountSuccess  = 'Datos actualizados correctamente.';
        setTimeout(() => { this.accountSuccess = null; }, 4000);
      },
      error: (err) => {
        this.accountError    = err.error?.error ?? 'Error al guardar los datos';
        this.isSavingAccount = false;
      }
    });
  }

  // ── Seguridad ─────────────────────────────────────────────────────────────

  savePassword(): void {
    if (!this.userId || this.isSavingPassword) return;
    this.passwordError   = null;
    this.passwordSuccess = null;

    if (!this.password.current || !this.password.new || !this.password.confirm) {
      this.passwordError = 'Completa todos los campos';
      return;
    }
    if (this.password.new !== this.password.confirm) {
      this.passwordError = 'Las contraseñas nuevas no coinciden';
      return;
    }
    if (this.password.new.length < 6) {
      this.passwordError = 'La nueva contraseña debe tener al menos 6 caracteres';
      return;
    }

    this.isSavingPassword = true;

    this.userService.changePassword(this.userId, this.password.current, this.password.new).subscribe({
      next: () => {
        this.isSavingPassword = false;
        this.password         = { current: '', new: '', confirm: '' };
        this.passwordSuccess  = 'Contraseña actualizada correctamente.';
        setTimeout(() => { this.passwordSuccess = null; }, 4000);
      },
      error: (err) => {
        this.passwordError    = err.error?.error ?? 'Error al cambiar la contraseña';
        this.isSavingPassword = false;
      }
    });
  }

  // ── Notificaciones (localStorage) ─────────────────────────────────────────

  private loadNotifications(userId: number): void {
    const stored = localStorage.getItem(NOTIF_KEY(userId));
    if (stored) {
      try { this.notifications = { ...this.notifications, ...JSON.parse(stored) }; } catch {}
    }
  }

  toggleNotification(key: string): void {
    this.notifications[key] = !this.notifications[key];
    if (this.userId) {
      localStorage.setItem(NOTIF_KEY(this.userId), JSON.stringify(this.notifications));
      this.notifSaved = true;
      setTimeout(() => { this.notifSaved = false; }, 2000);
    }
  }

  // ── Direcciones ───────────────────────────────────────────────────────────

  setDefault(id: number): void {
    this.addresses = this.addresses.map(a => ({ ...a, es_predeterminada: a.id === id }));
  }

  deleteAddress(id: number): void {
    this.addresses = this.addresses.filter(a => a.id !== id);
  }

  addAddress(): void {
    if (!this.newAddress.alias || !this.newAddress.direccion) return;
    this.addresses.push({
      id:               Date.now(),
      alias:            this.newAddress.alias,
      direccion:        this.newAddress.direccion,
      es_predeterminada: this.addresses.length === 0,
    });
    this.newAddress     = { alias: '', direccion: '' };
    this.showAddressForm = false;
  }
}
