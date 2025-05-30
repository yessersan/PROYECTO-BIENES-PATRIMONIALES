import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtiquetaDigitalDetailComponent } from './etiqueta-digital-detail.component';

describe('EtiquetaDigitalDetailComponent', () => {
  let component: EtiquetaDigitalDetailComponent;
  let fixture: ComponentFixture<EtiquetaDigitalDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EtiquetaDigitalDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EtiquetaDigitalDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
