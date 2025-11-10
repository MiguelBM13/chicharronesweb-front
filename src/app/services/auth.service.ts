import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/usuarios';
  private currentUserSubject: BehaviorSubject<any>;

  constructor(private http: HttpClient, private router: Router,) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<any>(storedUser ? JSON.parse(storedUser) : null);
    
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  public get isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }

  public get userRole(): 'CLIENTE' | 'ADMIN' | null {
    return this.isLoggedIn ? this.currentUserValue.rol : null;
  }

  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  /**
   * Registra un nuevo usuario.
   * @param userData Datos del usuario (nombre, email, password).
   */
  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/registro`, userData);
  }

  logout() {
    const usuario = this.currentUserValue;

    // ✅ Si había usuario, elimina su carrito del localStorage
    if (usuario && usuario.id) {
      localStorage.removeItem(`carrito_${usuario.id}`);
    }

    // Limpia la sesión
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  actualizarPerfil(id: number, datos: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, datos);
  }

  listarUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }
}

