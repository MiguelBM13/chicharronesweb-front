import { NotificacionService } from './../../services/notificacionService';
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';

interface Notificacion {
  id: number;
  tipo: string;
  mensaje: string;
  fecha: string | Date;
  leida: boolean;
}

@Component({
  selector: 'app-notificaciones',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css']
})
export class NotificacionesComponent implements OnInit, OnChanges {
  @Input() userId: number | null = null;
  @Input() role: string = 'CLIENTE';
  @Output() notificationRead = new EventEmitter<void>();

  notificaciones: Notificacion[] = [];
  cantidadNoLeidas: number = 0;
  tieneNoLeidas: boolean = false;
  loading: boolean = false;

  constructor(
    private notificacionService: NotificacionService,  // ✅ Ahora se encuentra
    private authService: AuthService
  ) { }

  trackById(index: number, item: Notificacion): number {
    return item.id;
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.cargarNotificaciones();
    }, 100);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userId'] && this.userId) {
      this.cargarNotificaciones();
    }
  }

  cargarNotificaciones(): void {
    let userId: number;

    if (this.userId) {
      userId = this.userId;
    } else {
      const currentUserId = this.authService.currentUserValue?.id;
      if (!currentUserId) {
        console.warn('No hay usuario logueado');
        this.loading = false;
        return;
      }
      userId = currentUserId;
    }

    this.loading = true;
    this.notificacionService.getNotificacionesPorUsuario(userId).subscribe({
      next: (data: Notificacion[]) => {
        this.notificaciones = data;
        this.actualizarNoLeidas();
        this.loading = false;
      },
      error: (error: any) => {  // ✅ TIPO 'any' EXPLÍCITO
        console.error('Error al cargar notificaciones', error);
        this.loading = false;
      }
    });
  }

  marcarComoLeida(id: number): void {
    this.notificacionService.marcarComoLeida(id).subscribe({
      next: () => {
        const notif = this.notificaciones.find(n => n.id === id);
        if (notif) {
          notif.leida = true;
          this.actualizarNoLeidas();
          if (this.cantidadNoLeidas === 0) {
            this.notificationRead.emit();
          }
        }
      },
      error: (error: any) => {  // ✅ TIPO 'any' EXPLÍCITO
        console.error('Error al marcar como leída', error);
      }
    });
  }

  marcarTodasLeidas(): void {
    const noLeidas = this.notificaciones.filter(n => !n.leida);
    noLeidas.forEach(n => {
      this.notificacionService.marcarComoLeida(n.id).subscribe({
        next: () => n.leida = true,
        error: (error: any) => { }  // ✅ TIPO 'any' EXPLÍCITO
      });
    });
    this.actualizarNoLeidas();
    if (this.cantidadNoLeidas === 0) {
      this.notificationRead.emit();
    }
  }

  private actualizarNoLeidas(): void {
    this.cantidadNoLeidas = this.notificaciones.filter(n => !n.leida).length;
    this.tieneNoLeidas = this.cantidadNoLeidas > 0;
  }
}
