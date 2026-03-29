import { Specification } from './Specification';

export interface Product {
  id_producto: number;
  sku: string;
  nombre: string;
  descripcion?: string;
  precio_venta: number;
  stock_actual: number;
  imagen_url: string;
  id_categoria?: number;
  categoria?: string;
  fecha_registro: string;
  especificaciones?: Specification[];
}