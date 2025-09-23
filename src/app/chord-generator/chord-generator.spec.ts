import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChordGenerator } from './chord-generator';

describe('ChordGenerator', () => {
  let component: ChordGenerator;
  let fixture: ComponentFixture<ChordGenerator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChordGenerator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChordGenerator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
