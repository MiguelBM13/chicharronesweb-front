import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../../services/producto.service';
import { CategoriaService } from '../../../services/categoria.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-maintenance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-maintenance.component.html',
  styleUrls: ['./product-maintenance.component.css']
})
export class ProductMaintenanceComponent implements OnInit {

  productos: any[] = [];
  categorias: any[] = [];
  productoSeleccionado: any = { categoria: {}, categoriaId: null, imagen_url: '' };
  esNuevo: boolean = true;
  cargando: boolean = false; // indicador opcional de carga

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService
  ) { }

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarCategorias();
    this.nuevoFormulario();
  }

  cargarProductos() {
    this.productoService.getProductos().subscribe(data => {
      this.productos = data;
    });
  }

  cargarCategorias() {
    this.categoriaService.getCategorias().subscribe(data => {
      this.categorias = data;

      // Asegura que la categoría se actualice correctamente en el producto seleccionado
      if (this.productoSeleccionado?.categoriaId) {
        const cat = this.categorias.find((c: any) => c.id === this.productoSeleccionado.categoriaId);
        if (cat) this.productoSeleccionado.categoria = cat;
      }
    });
  }

  seleccionarProducto(prod: any) {
    // 🔍 Determinamos el id de categoría correctamente
    const categoriaId = prod?.categoria?.id ?? prod?.categoria ?? prod?.categoriaId ?? null;

    // Buscamos el objeto de categoría completo si existe
    const categoriaObj = this.categorias?.find((c: any) => c.id === categoriaId) ?? (categoriaId ? { id: categoriaId } : null);

    // ✅ Mantenemos imagen_url en lugar de imagenUrl
    this.productoSeleccionado = {
      ...prod,
      categoria: categoriaObj,
      categoriaId,
      imagen_url: prod.imagen_url || ''  // 👈 coherente con el backend
    };

    this.esNuevo = false;
  }

  nuevoFormulario() {
    this.productoSeleccionado = {
      nombre: '',
      descripcion: '',
      precio: null,
      categoria: null,
      categoriaId: null,
      imagen_url: '', // ✅ coherente con backend
      disponible: false,
    };
    this.esNuevo = true;
  }

  guardarProducto() {
    this.cargando = true;

    const categoriaId = Number(
      this.productoSeleccionado?.categoriaId ??
      this.productoSeleccionado?.categoria?.id ??
      null
    );

    const productoId = this.productoSeleccionado?.id;

    // 🧩 Construcción del payload coherente con el backend
    let payload: any;

    if (productoId) {
      // 🔧 Actualización
      payload = {
        id: productoId,
        nombre: this.productoSeleccionado.nombre,
        descripcion: this.productoSeleccionado.descripcion,
        precio: this.productoSeleccionado.precio,
        imagen_url: this.productoSeleccionado.imagen_url, // 👈 campo correcto
        disponible: this.productoSeleccionado.disponible,
        categoria: categoriaId ? { id: categoriaId } : null
      };
    } else {
      // 🆕 Creación
      payload = {
        nombre: this.productoSeleccionado.nombre,
        descripcion: this.productoSeleccionado.descripcion,
        precio: this.productoSeleccionado.precio,
        imagen_url: this.productoSeleccionado.imagen_url, // 👈 coherente
        disponible: this.productoSeleccionado.disponible,
        categoriaId
      };
    }

    console.log('📦 Payload final a enviar:', JSON.stringify(payload, null, 2));

    // 🔁 Crear o actualizar según corresponda
    const request = productoId
      ? this.productoService.actualizarProducto(productoId, payload)
      : this.productoService.crearProducto(payload);

    request.subscribe({
      next: (resp) => {
        console.log(productoId ? '✅ Producto actualizado:' : '✅ Producto creado:', resp);
        this.cargarProductos();
        this.cargando = false;
        alert(productoId ? 'Producto actualizado correctamente' : 'Producto creado correctamente');
      },
      error: (err) => {
        console.error('❌ Error al guardar producto:', err);
        this.cargando = false;
        alert('Error al guardar producto. Revisa la consola o pestaña Network.');
      }
    });
  }

  eliminarProducto(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.productoService.eliminarProducto(id).subscribe(() => {
        this.cargarProductos();
      });
    }
  }
}
