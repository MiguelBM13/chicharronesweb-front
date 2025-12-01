import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { NotificacionesComponent } from '../../components/notificaciones/notificaciones.component';

import { AuthService } from '../../services/auth.service';
import { CarritoService } from '../../services/carrito.service';
import { NotificacionService } from '../../services/notificacionService';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, NotificacionesComponent],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit, OnDestroy {
  cartItemCount: number = 0;
  notificationCount: number = 0;

  private carritoSubscription!: Subscription;

  constructor(
    public authService: AuthService,
    private carritoService: CarritoService,
    private notificacionService: NotificacionService  // 🔔 Mantener para futuro uso
  ) { }

  ngOnInit(): void {
    // Suscribirse al carrito
    this.carritoSubscription = this.carritoService.carrito$.subscribe(items => {
      this.cartItemCount = items.reduce((total, item) => total + item.cantidad, 0);
    });

    // 🔔 NOTA: Ya no es necesario suscribirse aquí porque el componente 
    // de notificaciones emitirá los cambios automáticamente
  }

  // 🔔 NUEVO: Recibir actualizaciones del contador desde el componente hijo
  onCantidadNoLeidasChange(cantidad: number): void {
    this.notificationCount = cantidad;
  }

  // 🔔 MÉTODO PARA CUANDO SE MARCAN TODAS COMO LEÍDAS
  onNotificationRead(): void {
    this.notificationCount = 0;
  }

  ngOnDestroy(): void {
    if (this.carritoSubscription) {
      this.carritoSubscription.unsubscribe();
    }
  }
}
