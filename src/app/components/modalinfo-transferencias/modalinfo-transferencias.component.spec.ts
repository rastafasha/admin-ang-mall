import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalinfoTransferenciasComponent } from './modalinfo-transferencias.component';

describe('ModalinfoTransferenciasComponent', () => {
  let component: ModalinfoTransferenciasComponent;
  let fixture: ComponentFixture<ModalinfoTransferenciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalinfoTransferenciasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalinfoTransferenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
