import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigSiteComponent } from './config-site.component';

describe('ConfigSiteComponent', () => {
  let component: ConfigSiteComponent;
  let fixture: ComponentFixture<ConfigSiteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigSiteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
