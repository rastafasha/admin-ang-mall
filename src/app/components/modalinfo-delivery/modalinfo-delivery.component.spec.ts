import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalinfoDeliveryComponent } from './modalinfo-delivery.component';

describe('ModalinfoDeliveryComponent', () => {
  let component: ModalinfoDeliveryComponent;
  let fixture: ComponentFixture<ModalinfoDeliveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalinfoDeliveryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalinfoDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
