import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentoDetailComponent } from './documento-detail.component';

describe('DocumentoDetailComponent', () => {
  let component: DocumentoDetailComponent;
  let fixture: ComponentFixture<DocumentoDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentoDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentoDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
