import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearPostalComponent } from './crear-postal.component';

describe('CrearPostalComponent', () => {
  let component: CrearPostalComponent;
  let fixture: ComponentFixture<CrearPostalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearPostalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearPostalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
