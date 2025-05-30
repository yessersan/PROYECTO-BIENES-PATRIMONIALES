import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoIniciarComponent } from './mantenimiento-iniciar.component';

describe('MantenimientoIniciarComponent', () => {
  let component: MantenimientoIniciarComponent;
  let fixture: ComponentFixture<MantenimientoIniciarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MantenimientoIniciarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MantenimientoIniciarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
