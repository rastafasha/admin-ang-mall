import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposdepagoComponent } from './tiposdepago.component';

describe('TiposdepagoComponent', () => {
  let component: TiposdepagoComponent;
  let fixture: ComponentFixture<TiposdepagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TiposdepagoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TiposdepagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
