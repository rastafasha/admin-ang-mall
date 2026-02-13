import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidosMenuComponent } from './pedidos-menu.component';

describe('PedidosMenuComponent', () => {
  let component: PedidosMenuComponent;
  let fixture: ComponentFixture<PedidosMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PedidosMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PedidosMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
