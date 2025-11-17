import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {
  private apiUrl = 'http://localhost:8080/api/notificaciones'; // Ajusta si tu backend usa otro puerto

  constructor(private http: HttpClient) {}

  // 🔹 Obtener notificaciones por usuario
  getNotificacionesPorUsuario(usuarioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${usuarioId}`);
  }

  // 🔹 Marcar notificación como leída
  marcarComoLeida(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/leer`, {});
  }
}
