import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  mostrarModal: boolean = false; // ✅ AGREGAR
  mostrarModalEliminar: boolean = false; // ✅ AGREGAR
  categoriaAEliminar: any = null; // ✅ AGREGAR

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
    this.mostrarModal = true; // ✅ AGREGAR
  }

  nuevoFormulario() {
    this.categoriaSeleccionada = {
      nombre: '',
      descripcion: ''
    };
    this.esNuevo = true;
    this.mostrarModal = true; // ✅ AGREGAR
  }

  // ✅ AGREGAR MÉTODO
  cerrarModal() {
    this.mostrarModal = false;
  }

  guardarCategoria() {
    if (this.esNuevo) {
      this.categoriaService.crearCategoria(this.categoriaSeleccionada).subscribe({
        next: () => {
          this.cargarCategorias();
          this.cerrarModal(); // ✅ CAMBIAR
          alert('Categoría creada correctamente');
        },
        error: (err) => {
          console.error('Error al crear:', err);
          alert('Error al crear la categoría');
        }
      });
    } else {
      this.categoriaService.actualizarCategoria(this.categoriaSeleccionada.id, this.categoriaSeleccionada).subscribe({
        next: () => {
          this.cargarCategorias();
          this.cerrarModal(); // ✅ CAMBIAR
          alert('Categoría actualizada correctamente');
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          alert('Error al actualizar la categoría');
        }
      });
    }
  }

  // ✅ AGREGAR MÉTODOS DE ELIMINACIÓN
  abrirModalEliminar(categoria: any) {
    this.categoriaAEliminar = categoria;
    this.mostrarModalEliminar = true;
  }

  cerrarModalEliminar() {
    this.mostrarModalEliminar = false;
    this.categoriaAEliminar = null;
  }

  confirmarEliminar() {
    if (this.categoriaAEliminar) {
      this.categoriaService.eliminarCategoria(this.categoriaAEliminar.id).subscribe({
        next: () => {
          this.cargarCategorias();
          this.cerrarModalEliminar();
          alert('Categoría eliminada correctamente');
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
          alert('Error al eliminar la categoría');
        }
      });
    }
  }
}
