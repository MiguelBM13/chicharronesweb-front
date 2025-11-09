import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Importamos los componentes de mantenimiento que ahora serán hijos
import { CategoryMaintenanceComponent } from '../admin/category-maintenance/category-maintenance.component';
import { ProductMaintenanceComponent } from '../admin/product-maintenance/product-maintenance.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  // Añadimos los componentes de mantenimiento al array de imports
  imports: [
    CommonModule,
    FormsModule,
    CategoryMaintenanceComponent,
    ProductMaintenanceComponent
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  // Variable para controlar la vista actual
  vistaActual: 'categorias' | 'productos' = 'productos';

  constructor() {}

  ngOnInit(): void {
    // No necesitamos cargar pedidos aquí
  }

  // Método para cambiar la vista que se muestra
  cambiarVista(vista: 'categorias' | 'productos') {
    this.vistaActual = vista;
  }
}
