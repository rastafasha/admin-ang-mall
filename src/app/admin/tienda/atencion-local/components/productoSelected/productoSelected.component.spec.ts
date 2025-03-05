import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoSelectedComponent } from './productoSelected.component';

describe('ProductoSelectedComponent', () => {
    let component: ProductoSelectedComponent;
    let fixture: ComponentFixture<ProductoSelectedComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ ProductoSelectedComponent ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ProductoSelectedComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});