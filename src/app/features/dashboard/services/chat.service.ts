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

  constructor(private http: HttpClient) {}

  conectar(): void {
    this.socket = io(environment.socketUrl, {
      auth: {
        token: localStorage.getItem('access_token')
      }
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
    this.socket.emit('join_conversation', idConversacion);
  }

  enviarMensaje(idConversacion: number, idRemitente: number, contenido: string): void {
    this.socket.emit('send_message', {
      id_conversacion: idConversacion,
      id_remitente: idRemitente,
      contenido
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

  getConversacionesPorEmpresa(idEmpresa: number): Observable<Conversacion[]> {
    return this.http.get<Conversacion[]>(
      `${environment.apiUrl}/empresas/${idEmpresa}/conversaciones`
    );
  }

  getMensajes(idConversacion: number): Observable<Mensaje[]> {
    return this.http.get<Mensaje[]>(
      `${environment.apiUrl}/conversaciones/${idConversacion}/mensajes`
    );
  }

  subirArchivo(idConversacion: number, idRemitente: number, file: File, caption?: string): Observable<Mensaje> {
    const formData = new FormData();
    formData.append('archivo', file);
    formData.append('id_remitente', idRemitente.toString());
    if (caption?.trim()) formData.append('caption', caption.trim());

    return this.http.post<Mensaje>(
      `${environment.apiUrl}/conversaciones/${idConversacion}/archivo`,
      formData
    );
  }
}
