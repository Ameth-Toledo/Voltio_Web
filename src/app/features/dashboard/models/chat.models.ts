export interface Conversacion {
  id_conversacion: number;   
  id_usuario: number;
  id_empresa: number;
  nombre_usuario: string;
  ultimo_mensaje: string | null;
  ultimo_mensaje_fecha: string | null;
  no_leidos: number;
}

export interface Mensaje {
  id_mensaje: number;
  id_conversacion: number;
  id_remitente: number;
  nombre_remitente: string;
  contenido: string | null;
  tipo_mensaje: 'texto' | 'imagen' | 'video' | 'archivo';
  archivo_url: string | null;
  leido: boolean;
  created_at: string;
}