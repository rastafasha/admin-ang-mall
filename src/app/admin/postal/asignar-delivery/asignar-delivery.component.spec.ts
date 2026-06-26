import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarDeliveryComponent } from './asignar-delivery.component';

describe('AsignarDeliveryComponent', () => {
  let component: AsignarDeliveryComponent;
  let fixture: ComponentFixture<AsignarDeliveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsignarDeliveryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsignarDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
