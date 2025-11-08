import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private apiUrl = 'http://localhost:8080/api/pedidos';

  constructor(private http: HttpClient) { }

  /**
   * Envía un nuevo pedido al backend.
   * @param pedidoData Los datos del pedido (lista de productos y cantidades).
   */
  crearPedido(pedidoData: any): Observable<any> {
    return this.http.post(this.apiUrl, pedidoData);
  }

  /**
   * Obtiene todos los pedidos desde el backend (para el panel de admin).
   */
  getPedidos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
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
