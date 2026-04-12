export interface AppNotification {
  id: number;
  type: 'info' | 'success' | 'warning' | 'error' | 'chat';
  title: string;
  message: string;
  time: string;
  isNew: boolean;
  id_conversacion?: number;
}