import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProducListFeaturedComponent } from './produc-list-featured.component';

describe('ProducListFeaturedComponent', () => {
  let component: ProducListFeaturedComponent;
  let fixture: ComponentFixture<ProducListFeaturedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProducListFeaturedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProducListFeaturedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
