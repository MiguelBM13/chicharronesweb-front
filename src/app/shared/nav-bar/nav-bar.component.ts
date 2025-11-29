import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { NotificacionesComponent } from '../../components/notificaciones/notificaciones.component';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, NotificacionesComponent],  // 🆕 AGREGADO
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit, OnDestroy {
  // AGREGADO: VARIABLE PARA ALMACENAR EL CONTADOR DE ITEMS DEL CARRITO
  cartItemCount: number = 0;

  // 🆕 NUEVAS PROPIEDADES PARA NOTIFICACIONES

  notificationCount: number = 0;  // 1️⃣ Propiedad

  // AGREGADO: SUSCRIPCIÓN AL OBSERVABLE DEL CARRITO PARA ACTUALIZAR EL CONTADOR EN TIEMPO REAL
  private carritoSubscription!: Subscription;

  constructor(
    public authService: AuthService,
  ) { }

  // AGREGADO: MÉTODO QUE SE EJECUTA AL INICIALIZAR EL COMPONENTE
  ngOnInit(): void {

  }

  // 🆕 MÉTODO PARA CUANDO SE MARCA NOTIFICACIÓN COMO LEÍDA
  onNotificationRead(): void {
    this.notificationCount = 0;  // Ocultar badge
  }

  // AGREGADO: MÉTODO QUE SE EJECUTA AL DESTRUIR EL COMPONENTE
  ngOnDestroy(): void {
    // AGREGADO: CANCELAMOS LA SUSCRIPCIÓN PARA EVITAR FUGAS DE MEMORIA (MEMORY LEAKS)
    if (this.carritoSubscription) {
      this.carritoSubscription.unsubscribe();
    }
  }
}
