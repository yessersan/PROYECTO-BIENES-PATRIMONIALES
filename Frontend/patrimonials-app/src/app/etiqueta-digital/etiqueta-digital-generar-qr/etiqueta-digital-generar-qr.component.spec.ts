import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtiquetaDigitalGenerarQrComponent } from './etiqueta-digital-generar-qr.component';

describe('EtiquetaDigitalGenerarQrComponent', () => {
  let component: EtiquetaDigitalGenerarQrComponent;
  let fixture: ComponentFixture<EtiquetaDigitalGenerarQrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EtiquetaDigitalGenerarQrComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EtiquetaDigitalGenerarQrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
