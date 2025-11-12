import { Component, OnInit } from '@angular/core';
import { PedidoService } from '../../../services/pedido.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-gestion-pedidos',
  standalone: true,
  imports: [CommonModule,
    FormsModule],
  templateUrl: './gestion-pedidos.component.html',
  styleUrl: './gestion-pedidos.component.css'
})
export class GestionPedidosComponent implements OnInit {

  pedidos: any[] = [];
  estadosPosibles = ['PENDIENTE', 'EN_PREPARACION', 'LISTO', 'ENTREGADO', 'CANCELADO'];
  constructor(private pedidoService: PedidoService) { }

  ngOnInit(): void {
    this.cargarPedidos();
  }
  cargarPedidos() {
    this.pedidoService.getPedidos().subscribe(data => {
      this.pedidos = data.sort((a, b) => b.id - a.id);
    });
  }
  cambiarEstado(pedido: any, event: any) {
    const nuevoEstado = event.target.value;
    this.pedidoService.actualizarEstado(pedido.id, nuevoEstado).subscribe({
      next: (response) => {
        pedido.estado = response.estado;
        alert(`El pedido #${pedido.id} ha sido actualizado a ${response.estado}`);
      },
      error: (err) => {
        alert('Error al actualizar el estado del pedido.');
        console.error(err);
      }
    });
  }
}
