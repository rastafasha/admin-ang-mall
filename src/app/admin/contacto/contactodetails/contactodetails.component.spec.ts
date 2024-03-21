import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactodetailsComponent } from './contactodetails.component';

describe('ContactodetailsComponent', () => {
  let component: ContactodetailsComponent;
  let fixture: ComponentFixture<ContactodetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactodetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactodetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
