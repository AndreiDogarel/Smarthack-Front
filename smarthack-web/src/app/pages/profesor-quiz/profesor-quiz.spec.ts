import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfesorQuiz } from './profesor-quiz';

describe('ProfesorQuiz', () => {
  let component: ProfesorQuiz;
  let fixture: ComponentFixture<ProfesorQuiz>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfesorQuiz]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfesorQuiz);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
