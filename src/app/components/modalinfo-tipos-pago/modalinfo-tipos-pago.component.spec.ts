import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalinfoTiposPagoComponent } from './modalinfo-tipos-pago.component';

describe('ModalinfoTiposPagoComponent', () => {
  let component: ModalinfoTiposPagoComponent;
  let fixture: ComponentFixture<ModalinfoTiposPagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalinfoTiposPagoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalinfoTiposPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
