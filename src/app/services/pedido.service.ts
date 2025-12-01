import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { NotificacionService } from './notificacionService';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private apiUrl = 'http://localhost:8080/api/pedidos';

  constructor(private http: HttpClient, private authService: AuthService, private notificacionService: NotificacionService) { }
  /**
   * Envía un nuevo pedido al backend y notifica a los administradores.
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

    return this.http.post(this.apiUrl, pedidoConUsuario).pipe(
      tap((pedidoCreado: any) => {
        // Notificar a los administradores después de crear el pedido
        this.notificarAdministradoresNuevoPedido(pedidoCreado.id, usuario.nombre);
      })
    );
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

  /**
   * Actualiza el estado de un pedido y crea una notificación para el cliente.
   * @param id El ID del pedido a actualizar.
   * @param estado El nuevo estado del pedido.
   * @param usuarioId El ID del usuario del pedido.
   */
  actualizarEstadoConNotificacion(id: number, estado: string, usuarioId: number): Observable<any> {
    const url = `${this.apiUrl}/${id}/estado?estado=${estado}`;
    return this.http.put(url, {}).pipe(
      tap(() => {
        // Crear notificación después de actualizar el estado
        this.notificacionService.crearNotificacionCambioEstado(id, usuarioId, estado).subscribe({
          next: () => console.log('Notificación creada para cambio de estado'),
          error: (err: any) => console.error('Error al crear notificación:', err)
        });
      })
    );
  }

  /**
   * Notifica a todos los administradores sobre un nuevo pedido.
   * @param pedidoId El ID del pedido creado.
   * @param nombreUsuario El nombre del usuario que realizó el pedido.
   */
  private notificarAdministradoresNuevoPedido(pedidoId: number, nombreUsuario: string): void {
    // Obtener todos los usuarios administradores (asumiendo que hay un endpoint para esto)
    this.http.get<any[]>('http://localhost:8080/api/usuarios/administradores').subscribe({
      next: (admins) => {
        admins.forEach(admin => {
          const notificacion = {
            usuarioId: admin.id,
            tipo: 'NUEVO_PEDIDO',
            mensaje: `Nuevo pedido #${pedidoId} registrado por ${nombreUsuario}`,
            pedidoId: pedidoId
          };
          this.notificacionService.crearNotificacion(notificacion).subscribe({
            next: () => console.log(`Notificación enviada al admin ${admin.nombre}`),
            error: (err: any) => console.error('Error al crear notificación para admin:', err)
          });
        });
      },
      error: (err: any) => console.error('Error al obtener administradores:', err)
    });
  }

}
