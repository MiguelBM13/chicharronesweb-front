import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteVentasComponent } from './reporte-ventas.component';

describe('ReporteVentasComponent', () => {
  let component: ReporteVentasComponent;
  let fixture: ComponentFixture<ReporteVentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteVentasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteVentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
