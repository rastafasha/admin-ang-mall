import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasaeurobcvComponent } from './tasaeurobcv.component';

describe('TasaeurobcvComponent', () => {
  let component: TasaeurobcvComponent;
  let fixture: ComponentFixture<TasaeurobcvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TasaeurobcvComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TasaeurobcvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
