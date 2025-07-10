import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagosChequeComponent } from './pagos-cheque.component';

describe('PagosChequeComponent', () => {
  let component: PagosChequeComponent;
  let fixture: ComponentFixture<PagosChequeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagosChequeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagosChequeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
