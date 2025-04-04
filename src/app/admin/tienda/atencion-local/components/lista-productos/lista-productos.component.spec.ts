import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaProductosComponent } from './lista-productos.component';

describe('ListaProductosComponent', () => {
    let component: ListaProductosComponent;
    let fixture: ComponentFixture<ListaProductosComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ ListaProductosComponent ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ListaProductosComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});