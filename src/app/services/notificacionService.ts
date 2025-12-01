import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, interval, Observable, retry, shareReplay, startWith, switchMap, throwError, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NotificacionService {
    private apiUrl = 'http://localhost:8080/api/notificaciones';

    constructor(private http: HttpClient) { }

    // 🔹 Obtener notificaciones por usuario
    getNotificacionesPorUsuario(usuarioId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/${usuarioId}`).pipe(
            retry(2),  // Reintenta 2 veces si falla
            catchError(error => {
                console.error('Error al obtener notificaciones:', error);
                return throwError(() => error);
            })
        );
    }

    // 🔹 Marcar notificación como leída
    marcarComoLeida(id: number): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}/leer`, {});
    }

    // 🔹 Crear notificación para cambio de estado de pedido
    crearNotificacionCambioEstado(pedidoId: number, usuarioId: number, nuevoEstado: string): Observable<any> {
        const notificacion = {
            usuarioId: usuarioId,
            tipo: 'CAMBIO_ESTADO_PEDIDO',  // 🔔 CAMBIAR para que coincida con el backend
            mensaje: `Su pedido #${pedidoId} está: ${nuevoEstado}`,  // 🔔 Corrección ortográfica
            pedidoId: pedidoId
        };
        return this.http.post(this.apiUrl, notificacion);
    }

    // 🔹 Crear notificación general
    crearNotificacion(notificacion: any): Observable<any> {
        return this.http.post(this.apiUrl, notificacion);
    }

    // 🔹 Contar notificaciones sin leer
    contarNotificacionesSinLeer(usuarioId: number): Observable<number> {
        return this.http.get<number>(`${this.apiUrl}/${usuarioId}/sin-leer/count`).pipe(
            catchError(error => {
                console.error('Error al contar notificaciones:', error);
                return of(0);  // 🔔 Retornar 0 en caso de error
            })
        );
    }

    // 🔔 Polling automático de notificaciones cada 30 segundos
    polling30SegundosNotificaciones(usuarioId: number): Observable<any[]> {
        return interval(30000).pipe(
            startWith(0),  // Ejecutar inmediatamente
            switchMap(() => this.getNotificacionesPorUsuario(usuarioId)),
            catchError(error => {
                console.error('Error en polling de notificaciones:', error);
                return of([]);  // 🔔 Retornar array vacío en caso de error
            }),
            shareReplay(1)  // Compartir resultado entre suscriptores
        );
    }

    // 🔔 Polling del contador cada 10 segundos
    polling10SegundosContador(usuarioId: number): Observable<number> {
        return interval(10000).pipe(
            startWith(0),
            switchMap(() => this.contarNotificacionesSinLeer(usuarioId)),
            shareReplay(1)
        );
    }
}
