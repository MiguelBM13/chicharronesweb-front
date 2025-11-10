import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private apiUrl = 'http://localhost:8080/api/pedidos';

  constructor(private http: HttpClient, private authService: AuthService) { }
  /**
   * Envía un nuevo pedido al backend.
   * @param pedidoData Los datos del pedido (lista de productos y cantidades).
   */
  crearPedido(pedidoData: any): Observable<any> {
    const usuario = this.authService.currentUserValue; // 👈 Obtener usuario actual

    if (!usuario) {
      throw new Error('No hay usuario autenticado');
    }

    // Agregamos el usuarioId antes de enviar
    const pedidoConUsuario = {
      ...pedidoData,
      usuarioId: usuario.id
    };

    return this.http.post(this.apiUrl, pedidoConUsuario);
  }
  /**
   * Obtiene todos los pedidos desde el backend (para el panel de admin).
   */
  getPedidos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  /**
   * Obtiene los pedidos asociados a un usuario específico.
   * @param usuarioId ID del usuario logueado.
   */
  obtenerPedidosPorUsuario(usuarioId: number): Observable<any[]> {
    const url = `${this.apiUrl}/usuario/${usuarioId}`;
    return this.http.get<any[]>(url);
  }

  /**
   * Actualiza el estado de un pedido específico.
   * @param id El ID del pedido a actualizar.
   * @param estado El nuevo estado del pedido.
   */
  actualizarEstado(id: number, estado: string): Observable<any> {
    const url = `${this.apiUrl}/${id}/estado?estado=${estado}`;
    return this.http.put(url, {});
  }

}
