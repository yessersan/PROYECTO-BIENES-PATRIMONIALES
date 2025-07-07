import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsableListComponent } from './responsable-list.component';

describe('ResponsableListComponent', () => {
<<<<<<< HEAD
  let component: ResponsableListComponent;
  let fixture: ComponentFixture<ResponsableListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResponsableListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResponsableListComponent);
=======
  let component: ResponsableFormComponent;
  let fixture: ComponentFixture<ResponsableFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResponsableFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResponsableFormComponent);
>>>>>>> origin/yezer
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
<<<<<<< HEAD
});
=======
});
>>>>>>> origin/yezer
