import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteDetailComponent } from './reporte-detail.component';

describe('ReporteDetailComponent', () => {
  let component: ReporteDetailComponent;
  let fixture: ComponentFixture<ReporteDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReporteDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
