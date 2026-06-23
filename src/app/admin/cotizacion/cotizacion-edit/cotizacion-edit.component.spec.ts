import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CotizacionEditComponent } from './cotizacion-edit.component';

describe('CotizacionEditComponent', () => {
  let component: CotizacionEditComponent;
  let fixture: ComponentFixture<CotizacionEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CotizacionEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CotizacionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
