import { TestBed } from '@angular/core/testing';

import { PracticeService } from './services/practice.service';

describe('Practice', () => {
  let service: PracticeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PracticeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
