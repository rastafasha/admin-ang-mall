import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConectarWhatsappComponent } from './conectar-whatsapp.component';

describe('ConectarWhatsappComponent', () => {
  let component: ConectarWhatsappComponent;
  let fixture: ComponentFixture<ConectarWhatsappComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConectarWhatsappComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConectarWhatsappComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
