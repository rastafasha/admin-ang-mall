import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalinfoProductosComponent } from './modalinfo-productos.component';

describe('ModalinfoProductosComponent', () => {
  let component: ModalinfoProductosComponent;
  let fixture: ComponentFixture<ModalinfoProductosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalinfoProductosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalinfoProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
