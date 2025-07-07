import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UbicacionListComponent } from './ubicacion-list.component';

describe('UbicacionListComponent', () => {
  let component: UbicacionListComponent;
  let fixture: ComponentFixture<UbicacionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UbicacionListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UbicacionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
