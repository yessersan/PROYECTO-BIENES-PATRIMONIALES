import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriaDetailComponent } from './categoria-detail.component';

describe('CategoriaDetailComponent', () => {
  let component: CategoriaDetailComponent;
  let fixture: ComponentFixture<CategoriaDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CategoriaDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriaDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
