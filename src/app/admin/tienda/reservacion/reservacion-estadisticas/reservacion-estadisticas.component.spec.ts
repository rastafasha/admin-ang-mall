import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservacionEstadisticasComponent } from './reservacion-estadisticas.component';

describe('ReservacionEstadisticasComponent', () => {
  let component: ReservacionEstadisticasComponent;
  let fixture: ComponentFixture<ReservacionEstadisticasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservacionEstadisticasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservacionEstadisticasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
