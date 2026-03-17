import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalinfoPedidosListComponent } from './modalinfo-pedidos-list.component';

describe('ModalinfoPedidosListComponent', () => {
  let component: ModalinfoPedidosListComponent;
  let fixture: ComponentFixture<ModalinfoPedidosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalinfoPedidosListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalinfoPedidosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
