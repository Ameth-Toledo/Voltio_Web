import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  Wallet, TrendingUp, Clock, ArrowDownCircle,
  Loader, AlertCircle, CheckCircle, XCircle,
  CreditCard, Building2, ChevronDown, ChevronUp, Send
} from 'lucide-angular';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { HttpClient } from '@angular/common/http';
import { WalletService } from '../../services/wallet.service';
import { AuthService } from '../../../auth/services/auth.service';
import { Wallet as WalletModel, Retiro, MetodoRetiro } from '../../models/Wallet';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, LucideAngularModule],
  templateUrl: './wallet.component.html',
  styleUrl: './wallet.component.css'
})
export class WalletComponent implements OnInit {

  // ── Iconos ──────────────────────────────────────────────────────────────────
  readonly WalletIcon      = Wallet;
  readonly TrendingUp      = TrendingUp;
  readonly Clock           = Clock;
  readonly ArrowDownCircle = ArrowDownCircle;
  readonly Loader          = Loader;
  readonly AlertCircle     = AlertCircle;
  readonly CheckCircle     = CheckCircle;
  readonly XCircle         = XCircle;
  readonly CreditCard      = CreditCard;
  readonly Building2       = Building2;
  readonly ChevronDown     = ChevronDown;
  readonly ChevronUp       = ChevronUp;
  readonly Send            = Send;

  // ── Estado ──────────────────────────────────────────────────────────────────
  wallet:  WalletModel | null = null;
  retiros: Retiro[] = [];

  id_empresa: number | null = null;
  isLoading   = true;
  error:      string | null = null;
  successMsg: string | null = null;

  // Formulario de retiro
  mostrarFormRetiro = false;
  isSolicitando     = false;
  errorRetiro:      string | null = null;

  form = {
    monto:       null as number | null,
    metodo:      'transferencia' as MetodoRetiro,
    // Transferencia
    banco:       '',
    clabe:       '',
    titular:     '',
    // PayPal
    paypal_email: '',
  };

  constructor(
    private walletService: WalletService,
    private authService:   AuthService,
    private http:          HttpClient,
  ) {}

  ngOnInit(): void {
    this.resolverEmpresa();
  }

  private resolverEmpresa(): void {
    const user = this.authService.getUser();
    if (!user) {
      this.error     = 'No se encontró la sesión. Inicia sesión nuevamente.';
      this.isLoading = false;
      return;
    }

    // Obtener la empresa del usuario actual (mismo endpoint que usa el chat)
    this.http.get<any>(`${environment.apiUrl}/usuarios/${user.id}/empresa`).subscribe({
      next: (empresa) => {
        this.id_empresa = empresa.id_empresa;
        this.cargarDatos();
      },
      error: (err) => {
        console.error('[Wallet] Error obteniendo empresa:', err);
        this.error     = `No se encontró empresa (${err.status}: ${err.error?.error ?? err.message})`;
        this.isLoading = false;
      }
    });
  }

  cargarDatos(): void {
    if (!this.id_empresa) return;
    this.isLoading = true;
    this.error     = null;

    this.walletService.getWallet(this.id_empresa).subscribe({
      next: (w) => {
        this.wallet    = w;
        this.isLoading = false;
        this.cargarRetiros();
      },
      error: (err) => {
        console.error('[Wallet] Error cargando wallet:', err);
        this.error     = `Error al cargar el wallet (${err.status}: ${err.error?.error ?? err.message})`;
        this.isLoading = false;
      }
    });
  }

  cargarRetiros(): void {
    if (!this.id_empresa) return;
    this.walletService.getRetiros(this.id_empresa).subscribe({
      next: (r) => { this.retiros = r; },
      error: () => {}
    });
  }

  // ── Solicitar retiro ────────────────────────────────────────────────────────

  toggleFormRetiro(): void {
    this.mostrarFormRetiro = !this.mostrarFormRetiro;
    this.errorRetiro       = null;
    this.successMsg        = null;
    this.resetForm();
  }

  solicitarRetiro(): void {
    if (!this.id_empresa || this.isSolicitando) return;
    if (!this.form.monto || this.form.monto <= 0) {
      this.errorRetiro = 'Ingresa un monto válido';
      return;
    }

    let datos_cuenta: Record<string, any> = {};

    if (this.form.metodo === 'transferencia') {
      if (!this.form.banco || !this.form.clabe || !this.form.titular) {
        this.errorRetiro = 'Completa todos los datos de la transferencia';
        return;
      }
      datos_cuenta = { banco: this.form.banco, clabe: this.form.clabe, titular: this.form.titular };
    } else {
      if (!this.form.paypal_email) {
        this.errorRetiro = 'Ingresa tu correo de PayPal';
        return;
      }
      datos_cuenta = { paypal_email: this.form.paypal_email };
    }

    this.isSolicitando = true;
    this.errorRetiro   = null;

    this.walletService.solicitarRetiro({
      id_empresa: this.id_empresa,
      monto:      this.form.monto,
      metodo:     this.form.metodo,
      datos_cuenta,
    }).subscribe({
      next: () => {
        this.isSolicitando     = false;
        this.mostrarFormRetiro = false;
        this.successMsg        = 'Solicitud de retiro enviada correctamente. Se procesará en 1-3 días hábiles.';
        this.resetForm();
        this.cargarDatos();
      },
      error: (err) => {
        this.errorRetiro   = err.error?.error || 'Error al solicitar el retiro';
        this.isSolicitando = false;
      }
    });
  }

  private resetForm(): void {
    this.form = {
      monto:        null,
      metodo:       'transferencia',
      banco:        '',
      clabe:        '',
      titular:      '',
      paypal_email: '',
    };
  }

  // ── Helpers ─────────────────────────────────────────────────────────────────

  formatPrecio(monto: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency', currency: 'MXN'
    }).format(monto);
  }

  formatFecha(fecha: string | null): string {
    if (!fecha) return '—';
    return new Date(fecha).toLocaleDateString('es-MX', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  }

  estadoBadge(estado: string): string {
    switch (estado) {
      case 'pendiente': return 'bg-yellow-100 text-yellow-700';
      case 'procesado': return 'bg-green-100  text-green-700';
      case 'rechazado': return 'bg-red-100    text-red-700';
      default:          return 'bg-gray-100   text-gray-600';
    }
  }

  estadoLabel(estado: string): string {
    switch (estado) {
      case 'pendiente': return 'Pendiente';
      case 'procesado': return 'Procesado';
      case 'rechazado': return 'Rechazado';
      default:          return estado;
    }
  }

  metodoLabel(metodo: string): string {
    return metodo === 'paypal' ? 'PayPal' : 'Transferencia';
  }
}
