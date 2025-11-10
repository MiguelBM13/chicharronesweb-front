import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  // AGREGADO: COMMONMODULE PARA USAR *NGIF Y OTRAS DIRECTIVAS EN COMPONENTES STANDALONE
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
// AGREGADO: ONINT Y ONDESTROY PARA MANEJAR EL CICLO DE VIDA DEL COMPONENTE
export class NavBarComponent implements OnInit, OnDestroy {
  // AGREGADO: VARIABLE PARA ALMACENAR EL CONTADOR DE ITEMS DEL CARRITO
  cartItemCount: number = 0;
  // AGREGADO: SUSCRIPCIÓN AL OBSERVABLE DEL CARRITO PARA ACTUALIZAR EL CONTADOR EN TIEMPO REAL
  private carritoSubscription!: Subscription;

  constructor(
    public authService: AuthService,
    // AGREGADO: INYECCIÓN DEL SERVICIO DE CARRITO
    private carritoService: CarritoService
  ) { }

  // AGREGADO: MÉTODO QUE SE EJECUTA AL INICIALIZAR EL COMPONENTE
  ngOnInit(): void {
    
  }

  // AGREGADO: MÉTODO QUE SE EJECUTA AL DESTRUIR EL COMPONENTE
  ngOnDestroy(): void {
    // AGREGADO: CANCELAMOS LA SUSCRIPCIÓN PARA EVITAR FUGAS DE MEMORIA (MEMORY LEAKS)
    if (this.carritoSubscription) {
      this.carritoSubscription.unsubscribe();
    }
  }
}
