import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BienCreateComponent } from './bien-create.component';

describe('BienCreateComponent', () => {
  let component: BienCreateComponent;
  let fixture: ComponentFixture<BienCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BienCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BienCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
