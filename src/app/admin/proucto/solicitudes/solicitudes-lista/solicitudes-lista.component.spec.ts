import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesListaComponent } from './solicitudes-lista.component';

describe('SolicitudesListaComponent', () => {
  let component: SolicitudesListaComponent;
  let fixture: ComponentFixture<SolicitudesListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudesListaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitudesListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
