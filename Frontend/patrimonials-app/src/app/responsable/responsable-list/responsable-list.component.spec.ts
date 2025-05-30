import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsableListComponent } from './responsable-list.component';

describe('ResponsableListComponent', () => {
  let component: ResponsableListComponent;
  let fixture: ComponentFixture<ResponsableListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResponsableListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResponsableListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
