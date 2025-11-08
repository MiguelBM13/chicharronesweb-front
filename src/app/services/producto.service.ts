import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = 'http://localhost:8080/api/productos';

  constructor(private http: HttpClient) { }

  // Obtiene todos los productos
  getProductos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Crea un nuevo producto
  crearProducto(producto: any): Observable<any> {
    return this.http.post(this.apiUrl, producto);
  }

  // Actualiza un producto existente
  actualizarProducto(id: number, producto: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, producto);
  }

  // Elimina un producto
  eliminarProducto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
