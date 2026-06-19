import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackInstruccComponent } from './back-instrucc.component';

describe('BackInstruccComponent', () => {
  let component: BackInstruccComponent;
  let fixture: ComponentFixture<BackInstruccComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackInstruccComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackInstruccComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
