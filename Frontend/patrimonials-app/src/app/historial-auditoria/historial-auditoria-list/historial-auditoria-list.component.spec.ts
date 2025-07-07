import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialAuditoriaListComponent } from './historial-auditoria-list.component';

describe('HistorialAuditoriaListComponent', () => {
  let component: HistorialAuditoriaListComponent;
  let fixture: ComponentFixture<HistorialAuditoriaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HistorialAuditoriaListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorialAuditoriaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
