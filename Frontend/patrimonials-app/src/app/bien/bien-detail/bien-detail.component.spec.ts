import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BienDetailComponent } from './bien-detail.component';

describe('BienDetailComponent', () => {
  let component: BienDetailComponent;
  let fixture: ComponentFixture<BienDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BienDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BienDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
