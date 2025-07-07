import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoFinalizarComponent } from './mantenimiento-finalizar.component';

describe('MantenimientoFinalizarComponent', () => {
  let component: MantenimientoFinalizarComponent;
  let fixture: ComponentFixture<MantenimientoFinalizarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MantenimientoFinalizarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MantenimientoFinalizarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
