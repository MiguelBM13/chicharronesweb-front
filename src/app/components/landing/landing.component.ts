import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router'; // <-- Importa RouterLink// Importar para los enlaces

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink], // Añadir RouterLink
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  // No se necesita lógica compleja para esta página estática
}
