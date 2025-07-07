import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsableListComponent } from './responsable-list.component';

describe('ResponsableListComponent', () => {
  let component: ResponsableFormComponent;
  let fixture: ComponentFixture<ResponsableFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResponsableFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResponsableFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});