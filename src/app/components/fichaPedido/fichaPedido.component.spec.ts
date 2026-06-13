import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaPedidoComponent } from './fichaPedido.component';

describe('FichaPedidoComponent', () => {
    let component: FichaPedidoComponent;
    let fixture: ComponentFixture<FichaPedidoComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ FichaPedidoComponent ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FichaPedidoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});