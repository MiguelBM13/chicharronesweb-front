import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryMaintenanceComponent } from './category-maintenance.component';

describe('CategoryMaintenanceComponent', () => {
  let component: CategoryMaintenanceComponent;
  let fixture: ComponentFixture<CategoryMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryMaintenanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
