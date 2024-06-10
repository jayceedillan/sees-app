import { TestBed } from '@angular/core/testing';

import { SeesLibService } from './sees-lib.service';

describe('SeesLibService', () => {
  let service: SeesLibService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeesLibService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
