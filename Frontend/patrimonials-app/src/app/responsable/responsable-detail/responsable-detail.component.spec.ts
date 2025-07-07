import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsableDetailComponent } from './responsable-detail.component';

describe('ResponsableDetailComponent', () => {
  let component: ResponsableDetailComponent;
  let fixture: ComponentFixture<ResponsableDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResponsableDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResponsableDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
