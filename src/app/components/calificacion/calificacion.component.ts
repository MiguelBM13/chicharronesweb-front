import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CalificacionService } from '../../services/calificacion.service';

@Component({
  selector: 'app-calificacion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calificacion.component.html',
  styleUrls: ['./calificacion.component.css']
})
export class CalificacionComponent implements OnInit {
  pedidoId!: number;
  puntuacion: number = 5;
  comentario: string = '';
  estrellas: number[] = [1, 2, 3, 4, 5];

  // Nuevas propiedades
  calificacionExistente: any = null;
  modoEdicion: boolean = false;
  cargando: boolean = true;

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private calificacionService: CalificacionService
  ) { }

  ngOnInit(): void {
    this.pedidoId = +this.route.snapshot.paramMap.get('id')!;
    this.cargarCalificacion();
  }

  cargarCalificacion() {
    this.cargando = true;
    console.log('📡 Cargando calificación para pedido:', this.pedidoId);

    this.calificacionService.obtenerCalificacionPorPedido(this.pedidoId).subscribe({
      next: (calificacion) => {
        console.log('✅ Calificación encontrada:', calificacion);
        this.calificacionExistente = calificacion;
        this.puntuacion = calificacion.puntuacion;
        this.comentario = calificacion.comentario || '';
        this.cargando = false;
      },
      error: (err) => {
        console.log('ℹ️ No hay calificación previa (es normal si no se ha calificado)');
        this.calificacionExistente = null;
        this.cargando = false;
      }
    });
  }

  seleccionarEstrella(star: number) {
    // Solo permite seleccionar si está en modo edición o no hay calificación
    if (!this.calificacionExistente || this.modoEdicion) {
      this.puntuacion = star;
    }
  }

  habilitarEdicion() {
    this.modoEdicion = true;
  }

  guardarCalificacion() {
    const calificacion = {
      pedidoId: this.pedidoId,
      puntuacion: this.puntuacion,
      comentario: this.comentario
    };

    const accion = this.calificacionExistente ? 'actualizada' : 'guardada';

    this.calificacionService.crearCalificacion(calificacion).subscribe({
      next: () => {
        alert(`Calificación ${accion} correctamente`);
        this.router.navigate(['/pedidos']);
      },
      error: err => {
        console.error('Error al guardar calificación:', err);
        alert('Error al guardar la calificación');
      }
    });
  }

  cancelar() {
    this.router.navigate(['/pedidos']);
  }
}