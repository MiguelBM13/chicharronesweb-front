import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { CarritoService } from '../../services/carrito.service';
import { NotificacionService } from '../../services/notificaciones.service';
import { NotificacionesComponent } from '../../components/notificaciones/notificaciones.component';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, NotificacionesComponent],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit, OnDestroy {
  cartItemCount: number = 0;
  notificaciones: any[] = [];
  mostrarNotificaciones = false;
  private carritoSubscription!: Subscription;

  constructor(
    public authService: AuthService,
    private carritoService: CarritoService,
    private notificacionService: NotificacionService
  ) {}

  ngOnInit(): void {
    this.cargarNotificaciones();
  }

  ngOnDestroy(): void {
    if (this.carritoSubscription) this.carritoSubscription.unsubscribe();
  }

  cargarNotificaciones() {
    this.notificacionService.getNotificacionesPorUsuario(1).subscribe({
      next: data => this.notificaciones = data,
      error: err => console.error('Error cargando notificaciones:', err)
    });
  }

  toggleNotificaciones() {
    this.mostrarNotificaciones = !this.mostrarNotificaciones;
  }
}

