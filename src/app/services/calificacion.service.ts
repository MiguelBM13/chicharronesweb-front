import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Calificacion {
  id?: number;
  pedidoId: number;
  puntuacion: number;
  comentario: string;
  fechaRegistro?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CalificacionService {
  private apiUrl = 'http://localhost:8080/api/calificaciones';

  constructor(private http: HttpClient) { }

  /**
   * Crea o actualiza una calificación
   */
  crearCalificacion(calificacion: Calificacion): Observable<any> {
    return this.http.post<any>(this.apiUrl, calificacion);
  }

  /**
   * Obtiene la calificación de un pedido específico
   */
  obtenerCalificacionPorPedido(pedidoId: number): Observable<Calificacion> {
    return this.http.get<Calificacion>(`${this.apiUrl}/pedido/${pedidoId}`);
  }
}