import { NotificacionService } from './../../services/notificacionService';
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { catchError, forkJoin, of, Subscription } from 'rxjs';

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
export class NotificacionesComponent implements OnInit, OnChanges, OnDestroy {
  @Input() userId: number | null = null;
  @Input() role: string = 'CLIENTE';
  @Output() notificationRead = new EventEmitter<void>();
  @Output() cantidadNoLeidasChange = new EventEmitter<number>();  // 🔔 NUEVO: Emitir contador

  notificaciones: Notificacion[] = [];
  cantidadNoLeidas: number = 0;
  tieneNoLeidas: boolean = false;
  loading: boolean = false;

  private pollingSubscription?: Subscription;  // 🔔 NUEVO

  constructor(
    private notificacionService: NotificacionService,
    private authService: AuthService
  ) { }

  trackById(index: number, item: Notificacion): number {
    return item.id;
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.iniciarPolling();  // 🔔 MODIFICADO
    }, 100);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userId'] && this.userId) {
      this.iniciarPolling();  // 🔔 MODIFICADO
    }
  }

  ngOnDestroy(): void {  // 🔔 NUEVO
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }

  // 🔔 NUEVO: Iniciar polling automático cada 30 segundos
  iniciarPolling(): void {
    let userId: number;

    if (this.userId) {
      userId = this.userId;
    } else {
      const currentUserId = this.authService.currentUserValue?.id;
      if (!currentUserId) {
        console.warn('No hay usuario logueado');
        return;
      }
      userId = currentUserId;
    }

    // Cancelar polling anterior si existe
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }

    // Iniciar polling de notificaciones cada 30 segundos
    this.pollingSubscription = this.notificacionService
      .polling30SegundosNotificaciones(userId)
      .subscribe({
        next: (data: Notificacion[]) => {
          this.notificaciones = data;
          this.actualizarNoLeidas();
        },
        error: (error: any) => {
          console.error('Error al cargar notificaciones', error);
        }
      });
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
      error: (error: any) => {
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
      error: (error: any) => {
        console.error('Error al marcar como leída', error);
      }
    });
  }

  marcarTodasLeidas(): void {
    const noLeidas = this.notificaciones.filter(n => !n.leida);
    if (noLeidas.length === 0) return;

    const requests = noLeidas.map(n =>
      this.notificacionService.marcarComoLeida(n.id).pipe(
        catchError(() => of(null))
      )
    );

    forkJoin(requests).subscribe({
      next: () => {
        noLeidas.forEach(n => n.leida = true);
        this.actualizarNoLeidas();
        if (this.cantidadNoLeidas === 0) {
          this.notificationRead.emit();
        }
      }
    });
  }

  private actualizarNoLeidas(): void {
    this.cantidadNoLeidas = this.notificaciones.filter(n => !n.leida).length;
    this.tieneNoLeidas = this.cantidadNoLeidas > 0;
    this.cantidadNoLeidasChange.emit(this.cantidadNoLeidas);  // 🔔 NUEVO: Emitir al padre
  }
  // Agregar estos métodos al componente

  getIcono(tipo: string): string {
    const iconos: { [key: string]: string } = {
      'PEDIDO_CREADO': 'bi bi-bag-check-fill',
      'NUEVO_PEDIDO': 'bi bi-cart-plus-fill',
      'CAMBIO_ESTADO_PEDIDO': 'bi bi-clock-history',
      'PROMO': 'bi bi-tag-fill',
      'ALERTA': 'bi bi-exclamation-triangle-fill',
      'default': 'bi bi-bell-fill'
    };
    return iconos[tipo] || iconos['default'];
  }

  getIconClass(tipo: string): string {
    const clases: { [key: string]: string } = {
      'PEDIDO_CREADO': 'success',
      'NUEVO_PEDIDO': 'primary',
      'CAMBIO_ESTADO_PEDIDO': 'warning',
      'PROMO': 'info',
      'ALERTA': 'danger',
      'default': 'primary'
    };
    return clases[tipo] || clases['default'];
  }

  getTipoTexto(tipo: string): string {
    const textos: { [key: string]: string } = {
      'PEDIDO_CREADO': 'Pedido Creado',
      'NUEVO_PEDIDO': 'Nuevo Pedido',
      'CAMBIO_ESTADO_PEDIDO': 'Cambio de Estado',
      'PROMO': 'Promoción',
      'ALERTA': 'Alerta',
      'default': 'Notificación'
    };
    return textos[tipo] || textos['default'];
  }

}
