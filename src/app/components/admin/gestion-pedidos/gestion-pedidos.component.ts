import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PedidoService } from '../../../services/pedido.service';

interface Pedido {
  id: number;
  usuario: any;
  total: number;
  estado: 'PENDIENTE' | 'EN_PREPARACION' | 'LISTO' | 'ENTREGADO' | 'CANCELADO';
  fechaHora: string;
  detalles: any[];
  // agrega otros campos que tenga tu API
}

@Component({
  selector: 'app-gestion-pedidos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-pedidos.component.html',
  styleUrls: ['./gestion-pedidos.component.css']
})
export class GestionPedidosComponent implements OnInit {
  pedidos: Pedido[] = [];
  estadosPosibles: Pedido['estado'][] = ['PENDIENTE', 'EN_PREPARACION', 'LISTO', 'ENTREGADO', 'CANCELADO'];
  cargando: boolean = false;

  constructor(private pedidoService: PedidoService) {}

  ngOnInit(): void {
    this.cargarPedidos();
  }
  cargarPedidos() {
    this.cargando = true;
    this.pedidoService.getPedidos().subscribe({
      next: (data) => {
        this.pedidos = data.sort((a, b) => b.id - a.id);
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar pedidos', err);
        this.cargando = false;
      }
    });
  }

  // Cambia el estado de un pedido
  cambiarEstado(pedido: Pedido, event: any) {
    const nuevoEstado = event.target.value as Pedido['estado'];
    if (pedido.estado === nuevoEstado) return; // no hace nada si no cambia

    this.pedidoService.actualizarEstado(pedido.id, nuevoEstado).subscribe({
      next: (response) => {
        pedido.estado = response.estado;
        console.log(`Pedido #${pedido.id} actualizado a ${response.estado}`);
        // Aquí puedes agregar un toast si usas alguna librería como ngx-toastr
      },
      error: (err) => {
        console.error(`Error al actualizar el pedido #${pedido.id}`, err);
      }
    });
  }
}
