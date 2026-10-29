import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiendaRrssComponent } from './tienda-rrss.component';

describe('TiendaRrssComponent', () => {
  let component: TiendaRrssComponent;
  let fixture: ComponentFixture<TiendaRrssComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TiendaRrssComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TiendaRrssComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
