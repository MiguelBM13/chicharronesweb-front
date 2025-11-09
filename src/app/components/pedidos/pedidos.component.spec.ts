import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { PedidosComponent } from './pedidos.component';
import { PedidoService } from '../../services/pedido.service';

describe('PedidosComponent', () => {
  let component: PedidosComponent;
  let fixture: ComponentFixture<PedidosComponent>;
  let mockPedidoService: any;

  beforeEach(async () => {
    // 🧠 Simulamos el servicio
    mockPedidoService = {
      obtenerPedidosPorUsuario: jasmine.createSpy('obtenerPedidosPorUsuario').and.returnValue(of([
        {
          id: 1,
          fechaHora: '2025-11-08T12:00:00',
          total: 50.00,
          estado: 'PENDIENTE',
          detalles: [
            { producto: { nombre: 'Chicharrón clásico' }, cantidad: 2, precioUnitario: 25.00 }
          ]
        }
      ]))
    };

    await TestBed.configureTestingModule({
      imports: [PedidosComponent],
      providers: [
        { provide: PedidoService, useValue: mockPedidoService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load pedidos on init', () => {
    expect(mockPedidoService.obtenerPedidosPorUsuario).toHaveBeenCalled();
    expect(component.pedidos.length).toBe(1);
  });
});
