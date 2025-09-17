import { TestBed } from '@angular/core/testing';

import { MusicTheory } from './music-theory';

describe('MusicTheory', () => {
  let service: MusicTheory;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MusicTheory);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
