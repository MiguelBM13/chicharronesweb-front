import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { PedidoService } from '../../services/pedido.service';
import { AuthService } from '../../services/auth.service';

interface Pedido {
  id: number;
  fechaHora: string;
  estado: 'PENDIENTE' | 'EN_PREPARACION' | 'LISTO' | 'ENTREGADO' | 'CANCELADO';
  total: number;
  detalles: {
    cantidad: number;
    precioUnitario: number;
    producto: { nombre: string };
  }[];
}

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {

  pedidos$!: Observable<Pedido[]>; // 🔹 Reactivo: lo usaremos con async pipe

  clasesEstado: Record<string, string> = {
    PENDIENTE: 'estado-pendiente',
    EN_PREPARACION: 'estado-preparacion',
    LISTO: 'estado-listo',
    ENTREGADO: 'estado-entregado',
    CANCELADO: 'estado-cancelado'
  };

  constructor(
    private pedidoService: PedidoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const usuario = this.authService.currentUserValue;
    if (usuario) {
      this.pedidos$ = this.pedidoService.obtenerPedidosPorUsuario(usuario.id);
    } else {
      console.warn('⚠️ No hay usuario logeado');
    }
  }

  obtenerClaseEstado(estado: string): string {
    return this.clasesEstado[estado] || '';
  }
}
