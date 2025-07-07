import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoListComponent } from './mantenimiento-list.component';

describe('MantenimientoListComponent', () => {
  let component: MantenimientoListComponent;
  let fixture: ComponentFixture<MantenimientoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MantenimientoListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MantenimientoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
