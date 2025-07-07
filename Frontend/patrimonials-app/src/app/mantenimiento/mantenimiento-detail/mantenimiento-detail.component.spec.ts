import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoDetailComponent } from './mantenimiento-detail.component';

describe('MantenimientoDetailComponent', () => {
  let component: MantenimientoDetailComponent;
  let fixture: ComponentFixture<MantenimientoDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MantenimientoDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MantenimientoDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
