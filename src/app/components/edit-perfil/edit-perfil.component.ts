import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-perfil.component.html',
  styleUrls: ['./edit-perfil.component.css']
})
export class EditPerfilComponent implements OnInit {
  usuario: any = {}; // Datos del usuario a editar

  constructor(public authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      // Cargar datos del usuario logueado
      this.usuario = { ...currentUser };
    } else {
      // Si no hay usuario, redirigir al login
      this.router.navigate(['/login']);
    }
  }

  guardarCambios() {
    const id = this.usuario.id;
    this.authService.actualizarPerfil(id, this.usuario).subscribe({
      next: (data) => {
        alert('Perfil actualizado correctamente');
        // Actualizamos el usuario en localStorage y en el servicio
        localStorage.setItem('currentUser', JSON.stringify(data));
        this.authService['currentUserSubject'].next(data);
        this.router.navigate(['/menu']);
      },
      error: (err) => {
        console.error('Error al actualizar:', err);
        alert('No se pudo actualizar el perfil.');
      }
    });
  }

  cancelar() {
    this.router.navigate(['/menu']);
  }
}
