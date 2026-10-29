import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiendamercadolibreComponent } from './tiendamercadolibre.component';

describe('TiendamercadolibreComponent', () => {
  let component: TiendamercadolibreComponent;
  let fixture: ComponentFixture<TiendamercadolibreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TiendamercadolibreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TiendamercadolibreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
