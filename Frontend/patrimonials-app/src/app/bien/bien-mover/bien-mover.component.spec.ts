import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BienMoverComponent } from './bien-mover.component';

describe('BienMoverComponent', () => {
  let component: BienMoverComponent;
  let fixture: ComponentFixture<BienMoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BienMoverComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BienMoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
