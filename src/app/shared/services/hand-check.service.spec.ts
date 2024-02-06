import { TestBed } from '@angular/core/testing';

import { HandCheckService } from './hand-check.service';

describe('HandCheckService', () => {
  let service: HandCheckService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HandCheckService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
