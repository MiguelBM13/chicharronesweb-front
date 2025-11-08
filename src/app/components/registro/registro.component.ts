import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, CommonModule,RouterLink],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  userData = { nombre: '', email: '', password: '' };
  error: string = '';
  success: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    this.error = '';
    this.success = '';
    this.authService.register(this.userData).subscribe({
      next: () => {
        this.success = '¡Registro exitoso! Serás redirigido al inicio de sesión.';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000); 
      },
      error: (err) => {
        this.error = err.error || 'Ocurrió un error durante el registro.';
        console.error(err);
      }
    });
  }
}
