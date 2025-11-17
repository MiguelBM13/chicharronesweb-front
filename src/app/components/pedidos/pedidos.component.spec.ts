import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { PedidosComponent } from './pedidos.component';
import { PedidoService } from '../../services/pedido.service';
import { AuthService } from '../../services/auth.service';

// Datos simulados
const mockPedidos = [
  {
    id: 1,
    fechaHora: '2025-11-12T10:00:00',
    estado: 'LISTO',
    total: 50,
    detalles: [
      { cantidad: 1, precioUnitario: 50, producto: { nombre: 'Pollo Broaster' } }
    ]
  }
];

describe('PedidosComponent', () => {
  let component: PedidosComponent;
  let fixture: ComponentFixture<PedidosComponent>;
  let mockPedidoService: jasmine.SpyObj<PedidoService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    mockPedidoService = jasmine.createSpyObj('PedidoService', ['obtenerPedidosPorUsuario']);
    mockAuthService = jasmine.createSpyObj('AuthService', [], { currentUserValue: { id: 10 } });

    await TestBed.configureTestingModule({
      imports: [PedidosComponent],
      providers: [
        { provide: PedidoService, useValue: mockPedidoService },
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PedidosComponent);
    component = fixture.componentInstance;
  });

  it('debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar los pedidos si el usuario está logueado', () => {
    mockPedidoService.obtenerPedidosPorUsuario.and.returnValue(of(mockPedidos));

    component.ngOnInit();

    component.pedidos$.subscribe(pedidos => {
      expect(pedidos.length).toBe(1);
      expect(pedidos[0].id).toBe(1);
      expect(pedidos[0].estado).toBe('LISTO');
    });

    expect(mockPedidoService.obtenerPedidosPorUsuario).toHaveBeenCalledWith(10);
  });

  it('no debería llamar al servicio si no hay usuario logueado', () => {
    // Simula que no hay usuario
    Object.defineProperty(mockAuthService, 'currentUserValue', { get: () => null });

    spyOn(console, 'warn');
    component.ngOnInit();

    expect(console.warn).toHaveBeenCalledWith('⚠️ No hay usuario logeado');
    expect(mockPedidoService.obtenerPedidosPorUsuario).not.toHaveBeenCalled();
  });

  it('debería retornar la clase CSS correcta según el estado', () => {
    expect(component.obtenerClaseEstado('PENDIENTE')).toBe('estado-pendiente');
    expect(component.obtenerClaseEstado('LISTO')).toBe('estado-listo');
    expect(component.obtenerClaseEstado('ENTREGADO')).toBe('estado-entregado');
  });

  it('debería retornar cadena vacía si el estado no existe', () => {
    expect(component.obtenerClaseEstado('INEXISTENTE')).toBe('');
  });
});
