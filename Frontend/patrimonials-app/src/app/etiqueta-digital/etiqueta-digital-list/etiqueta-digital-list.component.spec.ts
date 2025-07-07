import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtiquetaDigitalListComponent } from './etiqueta-digital-list.component';

describe('EtiquetaDigitalListComponent', () => {
  let component: EtiquetaDigitalListComponent;
  let fixture: ComponentFixture<EtiquetaDigitalListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EtiquetaDigitalListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EtiquetaDigitalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
