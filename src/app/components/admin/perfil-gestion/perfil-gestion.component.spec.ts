import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilGestionComponent } from './perfil-gestion.component';

describe('PerfilGestionComponent', () => {
  let component: PerfilGestionComponent;
  let fixture: ComponentFixture<PerfilGestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilGestionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilGestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
