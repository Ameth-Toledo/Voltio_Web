import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../../environments/environment';
import { Conversacion, Mensaje } from '../models/chat.models';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private socket!: Socket;
  private mensajeNuevo$ = new Subject<Mensaje>();
  private usuarioEscribiendo$ = new Subject<string>();
  private usuarioDejoEscribir$ = new Subject<void>();
  private badgeUpdate$ = new Subject<{ id_conversacion: number; ultimo_mensaje?: string | null; tipo_mensaje?: string; ultimo_mensaje_fecha?: string }>();

  private idEmpresaActual: number | null = null;
  private idConversacionActual: number | null = null;

  constructor(private http: HttpClient) {}

  conectar(): void {
    this.socket = io(environment.socketUrl, {
      auth: { token: localStorage.getItem('access_token') }
    });

    // Re-unirse a los rooms al reconectar
    this.socket.on('connect', () => {
      if (this.idEmpresaActual) {
        this.socket.emit('join_empresa', this.idEmpresaActual);
      }
      if (this.idConversacionActual) {
        this.socket.emit('join_conversation', this.idConversacionActual);
      }
    });

    this.socket.on('badge_update', (data) => {
      this.badgeUpdate$.next(data);
    });

    this.socket.on('new_message', (msg: Mensaje) => {
      this.mensajeNuevo$.next(msg);
    });

    this.socket.on('user_typing', ({ nombre }: { nombre: string }) => {
      this.usuarioEscribiendo$.next(nombre);
    });

    this.socket.on('user_stop_typing', () => {
      this.usuarioDejoEscribir$.next();
    });
  }

  desconectar(): void {
    this.socket?.disconnect();
  }

  unirseAConversacion(idConversacion: number): void {
    this.idConversacionActual = idConversacion;
    this.socket.emit('join_conversation', idConversacion);
  }

  unirseAEmpresa(idEmpresa: number): void {
    this.idEmpresaActual = idEmpresa;
    this.socket.emit('join_empresa', idEmpresa);
  }

  enviarMensaje(idConversacion: number, idRemitente: number, contenido: string, idMensajeReply?: number | null): void {
    this.socket.emit('send_message', {
      id_conversacion: idConversacion,
      id_remitente: idRemitente,
      contenido,
      id_mensaje_reply: idMensajeReply ?? null
    });
  }

  marcarLeido(idConversacion: number, idUsuario: number): void {
    this.socket.emit('mark_read', {
      id_conversacion: idConversacion,
      id_usuario: idUsuario
    });
  }

  emitirEscribiendo(idConversacion: number, idUsuario: number, nombre: string): void {
    this.socket.emit('typing', {
      id_conversacion: idConversacion,
      id_usuario: idUsuario,
      nombre
    });
  }

  emitirDejoEscribir(idConversacion: number, idUsuario: number): void {
    this.socket.emit('stop_typing', {
      id_conversacion: idConversacion,
      id_usuario: idUsuario
    });
  }

  onMensajeNuevo(): Observable<Mensaje> {
    return this.mensajeNuevo$.asObservable();
  }

  onUsuarioEscribiendo(): Observable<string> {
    return this.usuarioEscribiendo$.asObservable();
  }

  onUsuarioDejoEscribir(): Observable<void> {
    return this.usuarioDejoEscribir$.asObservable();
  }

  onBadgeUpdate(): Observable<{ id_conversacion: number; ultimo_mensaje?: string | null; tipo_mensaje?: string; ultimo_mensaje_fecha?: string }> {
    return this.badgeUpdate$.asObservable();
  }

  getConversacionesPorEmpresa(idEmpresa: number): Observable<Conversacion[]> {
    return this.http.get<Conversacion[]>(
      `${environment.apiUrl}/empresas/${idEmpresa}/conversaciones?t=${Date.now()}`
    );
  }

  getMensajes(idConversacion: number): Observable<Mensaje[]> {
    return this.http.get<Mensaje[]>(
      `${environment.apiUrl}/conversaciones/${idConversacion}/mensajes?t=${Date.now()}`
    );
  }

  subirArchivo(idConversacion: number, idRemitente: number, file: File, caption?: string, idMensajeReply?: number | null): Observable<Mensaje> {
    const formData = new FormData();
    formData.append('archivo', file);
    formData.append('id_remitente', idRemitente.toString());
    if (caption?.trim()) formData.append('caption', caption.trim());
    if (idMensajeReply) formData.append('id_mensaje_reply', idMensajeReply.toString());

    return this.http.post<Mensaje>(
      `${environment.apiUrl}/conversaciones/${idConversacion}/archivo`,
      formData
    );
  }
}
