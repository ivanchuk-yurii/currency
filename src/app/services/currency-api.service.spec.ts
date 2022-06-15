import { TestBed } from '@angular/core/testing';

import { CurrencyApiService } from './currency-api.service';
import { HttpClientModule } from "@angular/common/http";

describe('CurrencyApiService', () => {
  let service: CurrencyApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientModule] });
    service = TestBed.inject(CurrencyApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
