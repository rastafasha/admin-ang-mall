import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarcaIndexComponent } from './marca-index.component';

describe('MarcaIndexComponent', () => {
  let component: MarcaIndexComponent;
  let fixture: ComponentFixture<MarcaIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarcaIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarcaIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
