import { TestBed } from '@angular/core/testing';

import { MercadolibreService } from './mercadolibre.service';

describe('MercadolibreService', () => {
  let service: MercadolibreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MercadolibreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
