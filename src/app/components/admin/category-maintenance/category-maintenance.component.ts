import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necesario para los formularios
import { CategoriaService } from '../../../services/categoria.service';

@Component({
  selector: 'app-category-maintenance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-maintenance.component.html',
  styleUrl: './category-maintenance.component.css'
})
export class CategoryMaintenanceComponent implements OnInit {

  categorias: any[] = [];
  categoriaSeleccionada: any = {};
  esNuevo: boolean = true;

  constructor(private categoriaService: CategoriaService) { }

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias() {
    this.categoriaService.getCategorias().subscribe(data => {
      this.categorias = data;
    });
  }

seleccionarCategoria(categoria: any) {
  if (!categoria?.id) {
    alert('La categoría seleccionada no tiene un ID válido.');
    return;
  }

  this.categoriaSeleccionada = { ...categoria };
  this.esNuevo = false;
}



  nuevoFormulario() {
    this.categoriaSeleccionada = {};
    this.esNuevo = true;
  }

  guardarCategoria() {
    if (this.esNuevo) {
      // Crear nueva categoría
      this.categoriaService.crearCategoria(this.categoriaSeleccionada).subscribe(() => {
        this.cargarCategorias();
        this.nuevoFormulario();
      });
    } else {
      // Actualizar categoría existente
      this.categoriaService.actualizarCategoria(this.categoriaSeleccionada.id, this.categoriaSeleccionada).subscribe(() => {
        this.cargarCategorias();
        this.nuevoFormulario();
      });
    }
  }

  eliminarCategoria(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      this.categoriaService.eliminarCategoria(id).subscribe(() => {
        this.cargarCategorias();
      });
    }
  }
}
