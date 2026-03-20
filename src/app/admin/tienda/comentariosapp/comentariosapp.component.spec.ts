import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComentariosappComponent } from './comentariosapp.component';

describe('ComentariosappComponent', () => {
  let component: ComentariosappComponent;
  let fixture: ComponentFixture<ComentariosappComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComentariosappComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComentariosappComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
