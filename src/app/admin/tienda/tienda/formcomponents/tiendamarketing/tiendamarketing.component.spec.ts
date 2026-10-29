import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiendamarketingComponent } from './tiendamarketing.component';

describe('TiendamarketingComponent', () => {
  let component: TiendamarketingComponent;
  let fixture: ComponentFixture<TiendamarketingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TiendamarketingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TiendamarketingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
