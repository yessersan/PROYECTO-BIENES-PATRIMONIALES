import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BienListComponent } from './bien-list.component';

describe('BienListComponent', () => {
  let component: BienListComponent;
  let fixture: ComponentFixture<BienListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BienListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BienListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
