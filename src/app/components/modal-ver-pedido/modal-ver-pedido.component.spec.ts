import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalVerPedidoComponent } from './modal-ver-pedido.component';

describe('ModalVerPedidoComponent', () => {
  let component: ModalVerPedidoComponent;
  let fixture: ComponentFixture<ModalVerPedidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalVerPedidoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalVerPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
