import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  // Carritos separados por ID de usuario
  private carritosPorUsuario: { [userId: number]: any[] } = {};

  // BehaviorSubject para emitir el estado actual del carrito a los componentes que se suscriban
  private carritoSubject = new BehaviorSubject<any[]>([]);
  public carrito$ = this.carritoSubject.asObservable();

  constructor(private authService: AuthService) {
    const usuario = this.authService.currentUserValue;
    if (usuario) {
      this.cargarCarritoDeUsuario(usuario.id);
    } else {
      this.carritoSubject.next([]);
    }

    // 🔁 Detecta cambios en el usuario (login / logout)
    this.authService['currentUserSubject'].subscribe(user => {
      if (user) {
        this.cargarCarritoDeUsuario(user.id);
      } else {
        this.limpiarCarrito();
      }
    });
  }

  /**
   * Carga el carrito desde localStorage del usuario logeado.
   */
  private cargarCarritoDeUsuario(userId: number) {
    const data = localStorage.getItem(`carrito_${userId}`);
    const carritoGuardado = data ? JSON.parse(data) : [];
    this.carritosPorUsuario[userId] = carritoGuardado;
    this.carritoSubject.next(carritoGuardado);
  }


  /**
   * Agrega un producto al carrito del usuario logeado.
   */
  agregarAlCarrito(producto: any) {
    const usuario = this.authService.currentUserValue;
    if (!usuario) return;

    const userId = usuario.id;
    if (!this.carritosPorUsuario[userId]) {
      this.carritosPorUsuario[userId] = [];
    }

    const items = this.carritosPorUsuario[userId];
    const itemExistente = items.find(item => item.id === producto.id);

    if (itemExistente) {
      itemExistente.cantidad++;
    } else {
      items.push({ ...producto, cantidad: 1 });
    }

    // ✅ Guardar en localStorage por usuario
    localStorage.setItem(`carrito_${userId}`, JSON.stringify(items));

    // Notifica cambios
    this.carritoSubject.next(items);

  }

  /**
   * Limpia todos los productos del carrito del usuario logeado.
   */
  limpiarCarrito() {
    const usuario = this.authService.currentUserValue;
    if (!usuario) return;

    this.carritosPorUsuario[usuario.id] = [];
    localStorage.removeItem(`carrito_${usuario.id}`);
    this.carritoSubject.next([]);

  }

  /**
   * Devuelve la cantidad total de productos en el carrito del usuario logeado.
   */
  obtenerCantidadTotal(): number {
    const usuario = this.authService.currentUserValue;
    if (!usuario || !this.carritosPorUsuario[usuario.id]) return 0;

    return this.carritosPorUsuario[usuario.id]
      .reduce((total, item) => total + item.cantidad, 0);
  }
}
