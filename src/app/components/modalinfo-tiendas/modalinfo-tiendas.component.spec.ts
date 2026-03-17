import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalinfoTiendasComponent } from './modalinfo-tiendas.component';

describe('ModalinfoTiendasComponent', () => {
  let component: ModalinfoTiendasComponent;
  let fixture: ComponentFixture<ModalinfoTiendasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalinfoTiendasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalinfoTiendasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
