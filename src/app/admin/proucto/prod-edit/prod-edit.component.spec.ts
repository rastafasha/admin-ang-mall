import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdEditComponent } from './prod-edit.component';

describe('ProdEditComponent', () => {
  let component: ProdEditComponent;
  let fixture: ComponentFixture<ProdEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProdEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
