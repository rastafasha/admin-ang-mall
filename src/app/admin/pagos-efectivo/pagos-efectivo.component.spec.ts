import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagosEfectivoComponent } from './pagos-efectivo.component';

describe('PagosEfectivoComponent', () => {
  let component: PagosEfectivoComponent;
  let fixture: ComponentFixture<PagosEfectivoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagosEfectivoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagosEfectivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
