export interface Order {
  id_orden: number;
  id_usuario: number;
  usuario?: string;
  email?: string;
  fecha_orden: string;
  estado_orden: 'pendiente' | 'confirmada' | 'en_proceso' | 'completada' | 'cancelada';
  monto_total: number;
  descripcion?: string;
  direccion: string;
  metodo_pago_tipo: 'tarjeta' | 'efectivo';
  metodo_pago_ultimos4?: string;
  detalles?: OrderDetail[];
}

export interface OrderDetail {
  id_detalle: number;
  id_orden: number;
  id_producto: number;
  nombre_producto?: string;
  imagen_url?: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}