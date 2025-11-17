import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PedidoService } from '../../services/pedido.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css'] // 👈 corregido (antes decía styleUrl)
})
export class PedidosComponent implements OnInit {

  pedidos: any[] = [];
  usuarioId!: number;
  cargando: boolean = true;


  constructor(
    private pedidoService: PedidoService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const usuario = this.authService.currentUserValue;
    if (usuario) {
      this.usuarioId = usuario.id;
      this.obtenerPedidos();
    } else {
      console.warn('No hay usuario logeado');
    }
  }

  obtenerPedidos(): void {
    this.cargando = true;

    this.pedidoService.obtenerPedidosPorUsuario(this.usuarioId).subscribe({
      next: (response) => {
        this.pedidos = response;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al obtener los pedidos:', err);
        this.cargando = false;
      }
    });
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleString();
  }

  obtenerClaseEstado(estado: string): string {
    switch (estado) {
      case 'PENDIENTE':
        return 'estado-pendiente';
      case 'EN_PREPARACION':
        return 'estado-preparacion';
      case 'LISTO':
        return 'estado-listo';
      case 'ENTREGADO':
        return 'estado-entregado';
      case 'CANCELADO':
        return 'estado-cancelado';
      default:
        return '';
    }
  }
}
