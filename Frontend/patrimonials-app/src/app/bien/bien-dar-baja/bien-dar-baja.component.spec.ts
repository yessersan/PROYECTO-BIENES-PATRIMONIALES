import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BienDarBajaComponent } from './bien-dar-baja.component';

describe('BienDarBajaComponent', () => {
  let component: BienDarBajaComponent;
  let fixture: ComponentFixture<BienDarBajaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BienDarBajaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BienDarBajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
