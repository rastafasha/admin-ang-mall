import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaTrasnferenciasComponent } from './lista-trasnferencias.component';

describe('ListaTrasnferenciasComponent', () => {
  let component: ListaTrasnferenciasComponent;
  let fixture: ComponentFixture<ListaTrasnferenciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaTrasnferenciasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaTrasnferenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
