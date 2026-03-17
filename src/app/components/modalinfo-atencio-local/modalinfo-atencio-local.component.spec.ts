import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalinfoAtencioLocalComponent } from './modalinfo-atencio-local.component';

describe('ModalinfoAtencioLocalComponent', () => {
  let component: ModalinfoAtencioLocalComponent;
  let fixture: ComponentFixture<ModalinfoAtencioLocalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalinfoAtencioLocalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalinfoAtencioLocalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
