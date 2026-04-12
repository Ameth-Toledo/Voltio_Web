export interface PlanBackend {
  id_plan: number;
  nombre: string;
  tipo_rol: 'empresa' | 'repartidor';
  precio: number;
  descripcion: string | null;
  limite_productos: number | null;
  paypal_plan_id: string | null;
  activo: boolean;
}

export type EstadoSuscripcion = 'pendiente' | 'activa' | 'gracia' | 'vencida' | 'cancelada';

export interface SuscripcionEstado {
  id_suscripcion: number;
  id_usuario: number;
  id_plan: number;
  nombre_plan: string;
  tipo_rol: string;
  precio_plan: number;
  paypal_subscription_id: string | null;
  estado: EstadoSuscripcion;
  fecha_inicio: string | null;
  fecha_vencimiento: string | null;
  fecha_fin_gracia: string | null;
  dias_gracia_restantes: number | null;
}
