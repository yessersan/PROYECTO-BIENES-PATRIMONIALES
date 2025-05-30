import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificacionListComponent } from './notificacion-list.component';

describe('NotificacionListComponent', () => {
  let component: NotificacionListComponent;
  let fixture: ComponentFixture<NotificacionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotificacionListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificacionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
