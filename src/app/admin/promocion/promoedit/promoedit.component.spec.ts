import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromoeditComponent } from './promoedit.component';

describe('PromoeditComponent', () => {
  let component: PromoeditComponent;
  let fixture: ComponentFixture<PromoeditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromoeditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromoeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
