import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  // Array privado para almacenar los items del carrito
  private items: any[] = [];
  // BehaviorSubject para emitir el estado actual del carrito a los componentes que se suscriban
  private carritoSubject = new BehaviorSubject<any[]>([]);

  // Observable público para que los componentes se suscriban
  public carrito$ = this.carritoSubject.asObservable();

  constructor() { }

  /**
   * Agrega un producto al carrito. Si ya existe, incrementa su cantidad.
   * @param producto El producto a agregar.
   */
  agregarAlCarrito(producto: any) {
    const itemExistente = this.items.find(item => item.id === producto.id);

    if (itemExistente) {
      itemExistente.cantidad++;
    } else {
      this.items.push({ ...producto, cantidad: 1 });
    }

    // Notifica a todos los suscriptores que el carrito ha cambiado
    this.carritoSubject.next(this.items);
  }

  /**
   * Limpia todos los productos del carrito.
   */
  limpiarCarrito() {
    this.items = [];
    this.carritoSubject.next(this.items);
  }
}
