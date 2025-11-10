import { Component, OnInit } from '@angular/core';
import { PedidoService } from '../../services/pedido.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Importamos los componentes de mantenimiento que ahora serán hijos
import { CategoryMaintenanceComponent } from '../admin/category-maintenance/category-maintenance.component';
import { ProductMaintenanceComponent } from '../admin/product-maintenance/product-maintenance.component';
import { GestionPerfilComponent } from '../gestion-perfil/gestion-perfil.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  // Añadimos los componentes de mantenimiento al array de imports
  imports: [
    CommonModule,
    FormsModule,
    CategoryMaintenanceComponent,
    ProductMaintenanceComponent,
    GestionPerfilComponent
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  // Variable para controlar la vista actual
  vistaActual: 'gestion-perfil'|'pedidos' | 'categorias' | 'productos' = 'pedidos';

  pedidos: any[] = [];
  estadosPosibles = ['PENDIENTE', 'EN_PREPARACION', 'LISTO', 'ENTREGADO', 'CANCELADO'];

  constructor(private pedidoService: PedidoService) {}

  ngOnInit(): void {
    this.cargarPedidos();
  }

  // Método para cambiar la vista que se muestra
  cambiarVista(vista: 'pedidos' | 'categorias' | 'productos'|'gestion-perfil') {
    this.vistaActual = vista;
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
