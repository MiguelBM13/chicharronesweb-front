import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductMaintenanceComponent } from './product-maintenance.component';

describe('ProductMaintenanceComponent', () => {
  let component: ProductMaintenanceComponent;
  let fixture: ComponentFixture<ProductMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductMaintenanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
