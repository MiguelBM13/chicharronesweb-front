import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-gestion-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-perfil.component.html',
  styleUrls: ['./gestion-perfil.component.css']
})
export class GestionPerfilComponent implements OnInit {
  usuarios: any[] = [];
  usuarioSeleccionado: any = null;
  cargando = false;
  modoEdicion = false;
  esAdmin = false;
  usuarioActual: any = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.usuarioActual = this.authService.currentUserValue; // usuario logueado
    this.esAdmin = this.authService.userRole === 'ADMIN';
    this.listarUsuarios();
  }

  listarUsuarios(): void {
    this.cargando = true;
    this.authService.listarUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al listar usuarios:', err);
        this.cargando = false;
      }
    });
  }

  editarUsuario(usuario: any): void {
    // Solo permitir editar si es admin o si el usuario es él mismo
    if (!this.esAdmin && usuario.id !== this.usuarioActual?.id) {
      alert('No tienes permiso para editar este usuario.');
      return;
    }

    this.usuarioSeleccionado = { ...usuario };
    this.modoEdicion = true;
  }

  guardarCambios(): void {
    if (!this.usuarioSeleccionado) return;

    // Si no es admin, no puede cambiar su rol
    if (!this.esAdmin) {
      this.usuarioSeleccionado.rol = this.usuarioActual.rol;
    }

    // Si no cambia contraseña, no la enviamos (evita el error 500 de null)
    if (!this.usuarioSeleccionado.password || this.usuarioSeleccionado.password.trim() === '') {
      delete this.usuarioSeleccionado.password;
    }

    this.authService.actualizarPerfil(this.usuarioSeleccionado.id, this.usuarioSeleccionado)
      .subscribe({
        next: () => {
          alert('Usuario actualizado correctamente.');
          this.modoEdicion = false;
          this.usuarioSeleccionado = null;
          this.listarUsuarios();
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          alert('Hubo un error al actualizar el usuario.');
        }
      });
  }

  cancelarEdicion(): void {
    this.modoEdicion = false;
    this.usuarioSeleccionado = null;
  }
}
  