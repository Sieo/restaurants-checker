import { TestBed } from '@angular/core/testing';

import { Cuisines } from './cuisines';

describe('Cuisines', () => {
  let service: Cuisines;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Cuisines);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
