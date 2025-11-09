import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/usuarios';
  private authUrl = 'http://localhost:8080/auth'; // ✅ URL para recuperación
  private currentUserSubject: BehaviorSubject<any>;

  constructor(private http: HttpClient, private router: Router) {
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

  // ✅ AGREGA ESTOS MÉTODOS PARA RECUPERACIÓN DE CONTRASEÑA
  recoverPassword(email: string): Observable<any> {
    return this.http.post(`${this.authUrl}/recover`, null, {
      params: { email }
    });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.authUrl}/reset`, {
      token,
      newPassword
    });
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
}