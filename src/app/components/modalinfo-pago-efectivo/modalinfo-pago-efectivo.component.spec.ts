import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalinfoPagoEfectivoComponent } from './modalinfo-pago-efectivo.component';

describe('ModalinfoPagoEfectivoComponent', () => {
  let component: ModalinfoPagoEfectivoComponent;
  let fixture: ComponentFixture<ModalinfoPagoEfectivoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalinfoPagoEfectivoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalinfoPagoEfectivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
