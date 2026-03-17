import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalinfoVentasComponent } from './modalinfo-ventas.component';

describe('ModalinfoVentasComponent', () => {
  let component: ModalinfoVentasComponent;
  let fixture: ComponentFixture<ModalinfoVentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalinfoVentasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalinfoVentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
