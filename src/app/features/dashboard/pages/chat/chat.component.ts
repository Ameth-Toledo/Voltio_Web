import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ChatService } from '../../services/chat.service';
import { Conversacion, Mensaje } from '../../models/chat.models';
import { AuthService } from '../../../auth/services/auth.service';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import 'emoji-picker-element';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('mensajesContainer') mensajesContainer!: ElementRef;

  conversaciones: Conversacion[] = [];
  conversacionSeleccionada: Conversacion | null = null;
  mensajes: Mensaje[] = [];

  searchTerm = '';
  nuevoMensaje = '';
  isLoadingConversaciones = false;
  isLoadingMensajes = false;
  escribiendo = '';
  idEmpresa = 0;
  idUsuario = 0;

  archivoPreview: File | null = null;
  archivoPreviewUrl: string | null = null;
  captionTexto = '';
  subiendoArchivo = false;

  replyingTo: Mensaje | null = null;
  mostrarEmojis = false;

  private shouldScroll = false;
  private destroy$ = new Subject<void>();
  private typingSubject$ = new Subject<void>();

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  get conversacionesFiltradas(): Conversacion[] {
    if (!this.searchTerm.trim()) return this.conversaciones;
    return this.conversaciones.filter(c =>
      c.nombre_usuario.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user) {
      this.idUsuario = user.id;
      this.obtenerEmpresa(user.id);
    }

    this.chatService.conectar();

    this.chatService.onMensajeNuevo()
      .pipe(takeUntil(this.destroy$))
      .subscribe((msg: Mensaje) => {
        if (this.conversacionSeleccionada?.id_conversacion === msg.id_conversacion) {
          this.mensajes.push(msg);
          this.shouldScroll = true;
          this.chatService.marcarLeido(msg.id_conversacion, this.idUsuario);
        }
        const conv = this.conversaciones.find(c => c.id_conversacion === msg.id_conversacion);
        if (conv) {
          conv.ultimo_mensaje = msg.tipo_mensaje === 'texto' ? msg.contenido : '📎 Archivo';
          conv.ultimo_mensaje_fecha = msg.created_at;
        }
      });

    this.chatService.onUsuarioEscribiendo()
      .pipe(takeUntil(this.destroy$))
      .subscribe((nombre) => { this.escribiendo = nombre; });

    this.chatService.onUsuarioDejoEscribir()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => { this.escribiendo = ''; });

    this.chatService.onBadgeUpdate()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        const conv = this.conversaciones.find(c => c.id_conversacion === data.id_conversacion);
        if (conv) {
          if (this.conversacionSeleccionada?.id_conversacion !== data.id_conversacion) {
            conv.no_leidos = (conv.no_leidos || 0) + 1;
          }
          if (data.ultimo_mensaje !== undefined) {
            conv.ultimo_mensaje = data.tipo_mensaje === 'texto' ? data.ultimo_mensaje : '📎 Archivo';
            conv.ultimo_mensaje_fecha = data.ultimo_mensaje_fecha ?? conv.ultimo_mensaje_fecha;
          }
        }
      });

    this.typingSubject$
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.conversacionSeleccionada) {
          this.chatService.emitirDejoEscribir(this.conversacionSeleccionada.id_conversacion, this.idUsuario);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.chatService.desconectar();
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollAlFinal();
      this.shouldScroll = false;
    }
  }

  obtenerEmpresa(idUsuario: number): void {
    this.http.get<any>(
      `${environment.apiUrl}/usuarios/${idUsuario}/empresa`,
    ).subscribe({
      next: (empresa) => {
        this.idEmpresa = empresa.id_empresa;
        this.chatService.unirseAEmpresa(this.idEmpresa);
        this.cargarConversaciones();
      },
      error: () => {
        console.error('No se encontró empresa para este usuario');
      }
    });
  }

  cargarConversaciones(): void {
    if (!this.idEmpresa) return;
    this.isLoadingConversaciones = true;
    this.chatService.getConversacionesPorEmpresa(this.idEmpresa).subscribe({
      next: (data) => {
        this.conversaciones = data;
        this.isLoadingConversaciones = false;
      },
      error: () => { this.isLoadingConversaciones = false; }
    });
  }

  seleccionarConversacion(conv: Conversacion): void {
    this.conversacionSeleccionada = conv;
    conv.no_leidos = 0;
    this.isLoadingMensajes = true;
    this.chatService.unirseAConversacion(conv.id_conversacion);

    this.chatService.getMensajes(conv.id_conversacion).subscribe({
      next: (data) => {
        this.mensajes = data;
        this.isLoadingMensajes = false;
        this.shouldScroll = true;
        this.chatService.marcarLeido(conv.id_conversacion, this.idUsuario);
      },
      error: () => { this.isLoadingMensajes = false; }
    });
  }

  onEscribiendo(): void {
    if (!this.conversacionSeleccionada) return;
    const user = this.authService.getUser();
    this.chatService.emitirEscribiendo(
      this.conversacionSeleccionada.id_conversacion,
      this.idUsuario,
      user?.name ?? 'Empresa'
    );
    this.typingSubject$.next();
  }

  enviarMensaje(): void {
    if (!this.nuevoMensaje.trim() || !this.conversacionSeleccionada) return;
    this.chatService.enviarMensaje(
      this.conversacionSeleccionada.id_conversacion,
      this.idUsuario,
      this.nuevoMensaje.trim(),
      this.replyingTo?.id_mensaje
    );
    this.nuevoMensaje = '';
    this.replyingTo = null;
    this.mostrarEmojis = false;
    this.typingSubject$.next();
  }

  subirArchivo(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length || !this.conversacionSeleccionada) return;
    const file = input.files[0];
    input.value = '';
    this.archivoPreview = file;
    this.captionTexto = '';

    if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
      const reader = new FileReader();
      reader.onload = (e) => this.archivoPreviewUrl = e.target?.result as string;
      reader.readAsDataURL(file);
    } else {
      this.archivoPreviewUrl = null;
    }
  }

  cancelarArchivoPreview(): void {
    this.archivoPreview = null;
    this.archivoPreviewUrl = null;
    this.captionTexto = '';
  }

  enviarArchivoConCaption(): void {
    if (!this.archivoPreview || !this.conversacionSeleccionada || this.subiendoArchivo) return;
    this.subiendoArchivo = true;

    this.chatService.subirArchivo(
      this.conversacionSeleccionada.id_conversacion,
      this.idUsuario,
      this.archivoPreview,
      this.captionTexto,
      this.replyingTo?.id_mensaje
    ).subscribe({
      next: () => {
        this.subiendoArchivo = false;
        this.archivoPreview = null;
        this.archivoPreviewUrl = null;
        this.captionTexto = '';
        this.replyingTo = null;
      },
      error: (err) => {
        console.error('Error subiendo archivo:', err);
        this.subiendoArchivo = false;
      }
    });
  }

  responderMensaje(msg: Mensaje): void {
    this.replyingTo = msg;
    this.mostrarEmojis = false;
  }

  cancelarRespuesta(): void {
    this.replyingTo = null;
  }

  insertarEmoji(event: Event): void {
    const emoji = (event as CustomEvent).detail?.unicode ?? '';
    if (this.archivoPreview) {
      this.captionTexto += emoji;
    } else {
      this.nuevoMensaje += emoji;
    }
    this.mostrarEmojis = false;
  }

  abrirImagen(url: string): void {
    window.open(url, '_blank');
  }

  private scrollAlFinal(): void {
    try {
      this.mensajesContainer.nativeElement.scrollTop =
        this.mensajesContainer.nativeElement.scrollHeight;
    } catch {
      // ignorado si el contenedor no está disponible
    }
  }
}
