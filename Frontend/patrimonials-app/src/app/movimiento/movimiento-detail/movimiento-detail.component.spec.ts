import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovimientoDetailComponent } from './movimiento-detail.component';

describe('MovimientoDetailComponent', () => {
  let component: MovimientoDetailComponent;
  let fixture: ComponentFixture<MovimientoDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MovimientoDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovimientoDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
