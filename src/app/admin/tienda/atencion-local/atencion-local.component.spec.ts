import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtencionLocalComponent } from './atencion-local.component';

describe('AtencionLocalComponent', () => {
  let component: AtencionLocalComponent;
  let fixture: ComponentFixture<AtencionLocalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AtencionLocalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AtencionLocalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
