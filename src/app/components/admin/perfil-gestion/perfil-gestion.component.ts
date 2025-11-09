import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: 'CLIENTE' | 'ADMIN';
  fechaRegistro: string;
}

@Component({
  selector: 'app-perfil-gestion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil-gestion.component.html',
  styleUrl: './perfil-gestion.component.css'
})
export class PerfilGestionComponent implements OnInit {
  usuarios: Usuario[] = [];
  cargando: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.cargando = true;
    this.authService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data.sort((a, b) => b.id - a.id);
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar usuarios', err);
        this.cargando = false;
      }
    });
  }
}
