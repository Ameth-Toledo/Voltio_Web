export interface Order {
  id_orden: number;
  id_usuario: number;
  usuario: string;
  fecha_orden: string;
  estado_orden: 'pendiente' | 'confirmada' | 'en_proceso' | 'completada' | 'cancelada';
  monto_total: number;
  direccion: string;
  metodo_pago_tipo: 'tarjeta' | 'efectivo';
  metodo_pago_ultimos4?: string;
}