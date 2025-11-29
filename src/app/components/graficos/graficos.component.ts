import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { DashboardService } from '../../services/dashboard.service';
import { CommonModule } from '@angular/common';

import {
  Chart,
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  DoughnutController, ChartConfiguration, ChartType,
  LineController,
  CategoryScale,
  LinearScale,
  Filler,
  Legend,
  Title,
  Tooltip
} from 'chart.js';

// Registrar solo los componentes necesarios
Chart.register(
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  DoughnutController,
  LineController,
  CategoryScale,
  LinearScale,
  Filler,
  Legend,
  Title,
  Tooltip
);

@Component({
  selector: 'app-graficos',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './graficos.component.html',
  styleUrl: './graficos.component.css'
})
export class GraficosComponent implements OnInit {

  @ViewChild(BaseChartDirective) chart: BaseChartDirective<'line'> | undefined;

  dashboardData: any | null = null;
  cargando = true;

  // Gráfico de línea - Ventas por día
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Ventas Diarias',
        fill: true,
        tension: 0.3,
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.2)'
      },
      {
        data: [],
        label: 'Cantidad de Pedidos',
        fill: false,
        borderColor: '#2196F3',
        backgroundColor: 'transparent',
        yAxisID: 'y1'
      }
    ]
  };

  public lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        position: 'left',
        title: {
          display: true,
          text: 'Ventas ($)'
        }
      },
      y1: {
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: 'Cantidad de Pedidos'
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      title: {
        display: true,
        text: 'Ventas de los Últimos 7 Días'
      }
    }
  };

  public lineChartType: ChartType = 'line';

  // Gráfico de dona - Pedidos por estado
  public doughnutChartLabels: string[] = [];
  public doughnutChartDatasets: ChartConfiguration<'doughnut'>['data']['datasets'] = [{
    data: [],
    backgroundColor: [],
    borderWidth: 2
  }];

  public doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'right'
      },
      title: {
        display: true,
        text: 'Distribución de Pedidos por Estado'
      }
    }
  };

  // Gráfico de barras - Productos más vendidos
  public barChartLabels: string[] = [];
  public barChartDatasets: ChartConfiguration<'bar'>['data']['datasets'] = [
    {
      data: [],
      label: 'Cantidad Vendida',
      backgroundColor: '#FF9800',
      borderColor: '#F57C00',
      borderWidth: 1
    }
  ];

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Cantidad'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Top 5 Productos Más Vendidos'
      }
    }
  };

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.cargarDatosDashboard();
  }

  cargarDatosDashboard(): void {
    this.cargando = true;
    this.dashboardService.obtenerDatosDashboard().subscribe({
      next: (data: any) => {
        this.dashboardData = data;
        this.actualizarGraficos(data);
        this.cargando = false;
      },
      error: (error: any) => {
        console.error('Error al cargar datos del dashboard:', error);
        this.cargando = false;
      }
    });
  }

  actualizarGraficos(data: any): void {
    const fechasFormateadas = data.ventasPorDia.map((v: any) => {
      const fecha = new Date(v.fecha);
      return fecha.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
    });

    this.lineChartData.labels = fechasFormateadas;
    this.lineChartData.datasets[0].data = data.ventasPorDia.map((v: any) => v.total);
    this.lineChartData.datasets[1].data = data.ventasPorDia.map((v: any) => v.cantidadPedidos);

    this.doughnutChartLabels = data.pedidosPorEstado.map((e: any) => e.estado.replace('_', ' '));
    this.doughnutChartDatasets[0].data = data.pedidosPorEstado.map((e: any) => e.cantidad);
    this.doughnutChartDatasets[0].backgroundColor = data.pedidosPorEstado.map((e: any) => e.color);

    this.barChartLabels = data.productosMasVendidos.map((p: any) => p.nombreProducto);
    this.barChartDatasets[0].data = data.productosMasVendidos.map((p: any) => p.cantidadVendida);

    this.chart?.update();
  }

  formatearMoneda(valor: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'PEN'
    }).format(valor);
  }
}