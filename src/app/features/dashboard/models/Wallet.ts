export interface Wallet {
  id_wallet:        number;
  id_empresa:       number;
  saldo_disponible: number;
  saldo_retenido:   number;
  total_ganado:     number;
  updated_at:       string;
}

export type EstadoRetiro = 'pendiente' | 'procesado' | 'rechazado';
export type MetodoRetiro = 'transferencia' | 'paypal';

export interface Retiro {
  id_retiro:    number;
  id_empresa:   number;
  monto:        number;
  metodo:       MetodoRetiro;
  datos_cuenta: Record<string, any>;
  estado:       EstadoRetiro;
  notas_admin:  string | null;
  procesado_at: string | null;
  created_at:   string;
}

export interface SolicitarRetiroRequest {
  id_empresa:   number;
  monto:        number;
  metodo:       MetodoRetiro;
  datos_cuenta: Record<string, any>;
}
