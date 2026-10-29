import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiendaMapaComponent } from './tienda-mapa.component';

describe('TiendaMapaComponent', () => {
  let component: TiendaMapaComponent;
  let fixture: ComponentFixture<TiendaMapaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TiendaMapaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TiendaMapaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
