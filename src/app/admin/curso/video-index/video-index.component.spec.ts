import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoIndexComponent } from './video-index.component';

describe('VideoIndexComponent', () => {
  let component: VideoIndexComponent;
  let fixture: ComponentFixture<VideoIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
