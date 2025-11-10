import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../../services/carrito.service';
import { PedidoService } from '../../services/pedido.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  items: any[] = [];
  total: number = 0;

  constructor(
    private carritoService: CarritoService,
    private pedidoService: PedidoService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carritoService.carrito$.subscribe(items => {
      this.items = items;
      this.calcularTotal();
    });
  }

  calcularTotal() {
    this.total = this.items.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  }

  realizarPedido() {
    if (this.items.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }

    const usuario = this.authService.currentUserValue;
    if (!usuario) {
      alert("Debes iniciar sesión para realizar un pedido.");
      return;
    }

    const detalles = this.items.map(item => ({
      productoId: item.id,
      cantidad: item.cantidad
    }));

    const pedido = {
      usuarioId: usuario.id,
      detalles: detalles
    };

    this.pedidoService.crearPedido(pedido).subscribe({
      next: (response) => {
        alert('¡Pedido realizado con éxito!');
        console.log('Pedido creado:', response);
        this.carritoService.limpiarCarrito();
        this.router.navigate(['/pedidos']);
      },
      error: (err) => {
        alert('Hubo un error al realizar el pedido.');
        console.error(err);
      }
    });
  }

  volverAlMenu() {
    this.router.navigate(['/menu']);
  }
}
