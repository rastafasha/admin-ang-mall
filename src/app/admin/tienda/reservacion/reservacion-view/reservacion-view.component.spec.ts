import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservacionViewComponent } from './reservacion-view.component';

describe('ReservacionViewComponent', () => {
  let component: ReservacionViewComponent;
  let fixture: ComponentFixture<ReservacionViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservacionViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservacionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
