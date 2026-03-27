import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cuisines } from './cuisines';

describe('Cuisines', () => {
  let component: Cuisines;
  let fixture: ComponentFixture<Cuisines>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cuisines]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cuisines);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
