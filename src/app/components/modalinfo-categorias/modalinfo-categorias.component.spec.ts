import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalinfoCategoriasComponent } from './modalinfo-categorias.component';

describe('ModalinfoCategoriasComponent', () => {
  let component: ModalinfoCategoriasComponent;
  let fixture: ComponentFixture<ModalinfoCategoriasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalinfoCategoriasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalinfoCategoriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
