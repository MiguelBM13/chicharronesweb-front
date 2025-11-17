import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NotificacionService } from '../../services/notificaciones.service';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-notificaciones',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css']
})
export class NotificacionesComponent implements OnInit {
  notificaciones: any[] = [];
  panelAbierto: boolean = false;
  tieneNoLeidas: boolean = false;
  mostrarPanel: boolean = false; // <--- agrega esto
  cantidadNoLeidas: number = 0;

  constructor(
    private notificacionService: NotificacionService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarNotificaciones();
  }

  cargarNotificaciones() {
    const usuarioId = 1; // o obtén del AuthService
    const userId = this.authService.currentUserValue?.id;
    if (!userId) return;
    this.notificacionService.getNotificacionesPorUsuario(userId).subscribe({
      next: (data: any[]) => this.notificaciones = data,
      error: (err: any) => console.error('Error al cargar notificaciones', err)
    });
  }

  togglePanel() {
    this.panelAbierto = !this.panelAbierto;
    if (this.panelAbierto) {
      // Marcar todas las no leídas como leídas
      this.notificaciones.filter(n => !n.leida).forEach(n => {
        this.notificacionService.marcarComoLeida(n.id).subscribe({
          next: () => n.leida = true,
          error: (err: any) => console.error('Error al marcar como leída', err)
        });
      });
    }
  }

  contarNoLeidas(): number {
    return this.notificaciones.filter(n => !n.leida).length;
  }

  marcarComoLeida(id: number): void {
    this.notificacionService.marcarComoLeida(id)
      .subscribe({
        next: () => {
          const notif = this.notificaciones.find(n => n.id === id);
          if (notif) notif.leida = true;
          this.actualizarNoLeidas();
        },
        error: (err) => console.error('Error al marcar como leída', err)
      });
  }

  private actualizarNoLeidas(): void {
    this.cantidadNoLeidas = this.notificaciones.filter(n => !n.leida).length;
    this.tieneNoLeidas = this.cantidadNoLeidas > 0;
  }
}
