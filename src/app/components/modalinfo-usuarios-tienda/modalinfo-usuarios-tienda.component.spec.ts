import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalinfoUsuariosTiendaComponent } from './modalinfo-usuarios-tienda.component';

describe('ModalinfoUsuariosTiendaComponent', () => {
  let component: ModalinfoUsuariosTiendaComponent;
  let fixture: ComponentFixture<ModalinfoUsuariosTiendaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalinfoUsuariosTiendaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalinfoUsuariosTiendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
