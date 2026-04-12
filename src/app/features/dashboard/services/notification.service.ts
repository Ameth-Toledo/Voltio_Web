import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { AuthService } from '../../auth/services/auth.service';
import { AppNotification } from '../models/Notification';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private socket!: Socket;
  private notifications: AppNotification[] = [];
  private notifications$ = new BehaviorSubject<AppNotification[]>([]);
  private unreadCount$ = new BehaviorSubject<number>(0);
  private nextId = 1;
  private initialized = false;

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) {}

  init(): void {
    if (this.initialized) return;
    this.initialized = true;

    const user = this.authService.getUser();
    if (!user) return;

    this.socket = io(environment.notificationsUrl, {
      auth: { token: localStorage.getItem('access_token') }
    });

    this.http.get<any>(`${environment.apiUrl}/usuarios/${user.id}/empresa`).subscribe({
      next: (empresa) => {
        this.socket.emit('join_empresa', empresa.id_empresa);
        this.suscribirse();
      },
      error: () => {}
    });
  }

  private suscribirse(): void {
    // Mensajes de chat
    this.socket.on('badge_update', (data: { id_conversacion: number; ultimo_mensaje?: string | null; tipo_mensaje?: string }) => {
      const cuerpo = data.tipo_mensaje === 'texto'
        ? (data.ultimo_mensaje || 'Nuevo mensaje')
        : 'Archivo adjunto';

      this.agregar({
        id: this.nextId++,
        type: 'chat',
        title: 'Nuevo mensaje',
        message: cuerpo,
        time: 'Ahora',
        isNew: true,
        id_conversacion: data.id_conversacion
      });

      if (document.hidden && Notification.permission === 'granted') {
        new Notification('Nuevo mensaje', { body: cuerpo, icon: '/favicon.ico' });
      }
    });

    // Nuevo pedido
    this.socket.on('nueva_orden', (data: any) => {
      const orden = data?.datos;
      this.agregar({
        id: this.nextId++,
        type: 'info',
        title: 'Nuevo pedido',
        message: orden?.id_orden ? `Pedido #${orden.id_orden} recibido` : 'Se ha recibido un nuevo pedido',
        time: 'Ahora',
        isNew: true
      });

      if (Notification.permission === 'granted') {
        new Notification('Nuevo pedido', {
          body: orden?.id_orden ? `Pedido #${orden.id_orden} recibido` : 'Se ha recibido un nuevo pedido',
          icon: '/favicon.ico'
        });
      }
    });

    this.socket.on('orden_eliminada', (data: any) => {
      const orden = data?.datos;
      this.agregar({
        id: this.nextId++,
        type: 'warning',
        title: 'Pedido cancelado',
        message: orden?.id_orden ? `Pedido #${orden.id_orden} fue cancelado` : 'Un pedido fue cancelado',
        time: 'Ahora',
        isNew: true
      });
    });

    this.socket.on('order_status_changed', (data: any) => {
      this.agregar({
        id: this.nextId++,
        type: 'success',
        title: 'Estado de pedido actualizado',
        message: data?.orderId ? `Pedido #${data.orderId} → ${data.status}` : 'Un pedido actualizó su estado',
        time: 'Ahora',
        isNew: true
      });
    });
  }

  agregar(n: AppNotification): void {
    this.notifications = [n, ...this.notifications];
    this.notifications$.next([...this.notifications]);
    this.unreadCount$.next(this.notifications.filter(x => x.isNew).length);
  }

  getNotifications(): Observable<AppNotification[]> {
    return this.notifications$.asObservable();
  }

  getUnreadCount(): Observable<number> {
    return this.unreadCount$.asObservable();
  }

  marcarTodasLeidas(): void {
    this.notifications = this.notifications.map(n => ({ ...n, isNew: false }));
    this.notifications$.next([...this.notifications]);
    this.unreadCount$.next(0);
  }

  solicitarPermiso(): void {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }
}
