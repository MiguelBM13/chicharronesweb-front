import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router'; // <-- Importa RouterLink
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  
  styleUrl: './login.component.css'
})
export class LoginComponent {
  credentials = { email: '', password: '' };
  error: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.authService.login(this.credentials).subscribe({
      next: (user) => {
        if (user.rol === 'ADMIN') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/menu']);
        }
      },
      error: (err) => {
        this.error = 'Error en el inicio de sesión. Verifique sus credenciales.';
        console.error(err);
      }
    });
  }
}
