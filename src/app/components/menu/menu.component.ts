import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { CategoriaService } from '../../services/categoria.service';
import { CarritoService } from '../../services/carrito.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importar para la barra de búsqueda

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule], // Añadir FormsModule
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {

  productos: any[] = [];
  productosFiltrados: any[] = [];
  categorias: any[] = [];

  categoriaSeleccionadaId: number | null = null;
  terminoBusqueda: string = '';

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private carritoService: CarritoService
  ) {}

  ngOnInit(): void {
    this.cargarCategorias();
    this.cargarProductos();
  }

  cargarCategorias() {
    this.categoriaService.getCategorias().subscribe(data => {
      this.categorias = data;
    });
  }

  cargarProductos() {
    this.productoService.getProductos().subscribe(data => {
      this.productos = data;
      this.aplicarFiltros(); // Aplicar filtros al cargar los productos
    });
  }

  filtrarPorCategoria(id: number | null) {
    this.categoriaSeleccionadaId = id;
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    let productosTemp = this.productos.filter(p => p.disponible);

    // 1. Filtrar por categoría
    if (this.categoriaSeleccionadaId) {
      productosTemp = productosTemp.filter(p => p.categoria.id === this.categoriaSeleccionadaId);
    }

    // 2. Filtrar por término de búsqueda
    if (this.terminoBusqueda) {
      productosTemp = productosTemp.filter(p =>
        p.nombre.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
      );
    }

    this.productosFiltrados = productosTemp;
  }

  agregarProducto(producto: any) {
    this.carritoService.agregarAlCarrito(producto);
    // Podríamos reemplazar este alert por una notificación más sutil (toast)
    this.mostrarToast(`'${producto.nombre}' ha sido añadido al carrito`);

  }

  mensajeToast: string | null = null;

mostrarToast(mensaje: string) {
  this.mensajeToast = mensaje;
  setTimeout(() => this.mensajeToast = null, 3000); // se oculta automáticamente
}

cerrarToast() {
  this.mensajeToast = null;
}

}
