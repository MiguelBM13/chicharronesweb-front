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
  cargando: boolean = false;
  mostrarModal: boolean = false; // ✅ AGREGAR ESTA LÍNEA

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService
  ) { }

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarCategorias();
  }

  cargarProductos() {
    this.productoService.getProductos().subscribe(data => {
      this.productos = data;
    });
  }

  cargarCategorias() {
    this.categoriaService.getCategorias().subscribe(data => {
      this.categorias = data;

      if (this.productoSeleccionado?.categoriaId) {
        const cat = this.categorias.find((c: any) => c.id === this.productoSeleccionado.categoriaId);
        if (cat) this.productoSeleccionado.categoria = cat;
      }
    });
  }

  seleccionarProducto(prod: any) {
    const categoriaId = prod?.categoria?.id ?? prod?.categoria ?? prod?.categoriaId ?? null;
    const categoriaObj = this.categorias?.find((c: any) => c.id === categoriaId) ?? (categoriaId ? { id: categoriaId } : null);

    this.productoSeleccionado = {
      ...prod,
      categoria: categoriaObj,
      categoriaId,
      imagen_url: prod.imagen_url || ''
    };

    this.esNuevo = false;
    this.mostrarModal = true; // ✅ AGREGAR ESTA LÍNEA
  }

  nuevoFormulario() {
    this.productoSeleccionado = {
      nombre: '',
      descripcion: '',
      precio: null,
      categoria: null,
      categoriaId: null,
      imagen_url: '',
      disponible: false,
    };
    this.esNuevo = true;
    this.mostrarModal = true; // ✅ AGREGAR ESTA LÍNEA
  }

  // ✅ AGREGAR ESTE MÉTODO
  cerrarModal() {
    this.mostrarModal = false;
  }

  guardarProducto() {
    this.cargando = true;

    const categoriaId = Number(
      this.productoSeleccionado?.categoriaId ??
      this.productoSeleccionado?.categoria?.id ??
      null
    );

    const productoId = this.productoSeleccionado?.id;

    let payload: any;

    if (productoId) {
      payload = {
        id: productoId,
        nombre: this.productoSeleccionado.nombre,
        descripcion: this.productoSeleccionado.descripcion,
        precio: this.productoSeleccionado.precio,
        imagen_url: this.productoSeleccionado.imagen_url,
        disponible: this.productoSeleccionado.disponible,
        categoria: categoriaId ? { id: categoriaId } : null
      };
    } else {
      payload = {
        nombre: this.productoSeleccionado.nombre,
        descripcion: this.productoSeleccionado.descripcion,
        precio: this.productoSeleccionado.precio,
        imagen_url: this.productoSeleccionado.imagen_url,
        disponible: this.productoSeleccionado.disponible,
        categoriaId
      };
    }

    console.log('📦 Payload final a enviar:', JSON.stringify(payload, null, 2));

    const request = productoId
      ? this.productoService.actualizarProducto(productoId, payload)
      : this.productoService.crearProducto(payload);

    request.subscribe({
      next: (resp) => {
        console.log(productoId ? '✅ Producto actualizado:' : '✅ Producto creado:', resp);
        this.cargarProductos();
        this.cargando = false;
        this.cerrarModal(); // ✅ AGREGAR ESTA LÍNEA
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
