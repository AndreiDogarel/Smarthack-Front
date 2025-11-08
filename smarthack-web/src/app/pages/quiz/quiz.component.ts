// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { QuestionService, QuestionDto } from '../../core/question.service';

// @Component({
//   selector: 'app-quiz',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './quiz.component.html',
//   styleUrls: ['./quiz.component.css']
// })
// export class QuizComponent implements OnInit {
//   questions: QuestionDto[] = [];
//   question: QuestionDto | null = null;
//   selectedAnswer: string | null = null;
//   result: string | null = null;

//   constructor(private questionService: QuestionService) {}

//   ngOnInit() {
//     this.loadQuestions();
//   }

//   loadQuestions() {
//     this.questionService.getQuestionsByDomain('test').subscribe({
//       next: (data) => {
//         this.questions = data;
//         if (data.length > 0) {
//           this.question = data[Math.floor(Math.random() * data.length)];
//         }
//       },
//       error: (err) => {
//         console.error('Eroare la încărcarea întrebărilor:', err);
//       }
//     });
//   }

//   selectAnswer(answer: string) {
//     this.selectedAnswer = answer;
//   }

//   checkAnswer() {
//     if (!this.selectedAnswer || !this.question) return;

//     this.result =
//       this.selectedAnswer === this.question.correctAnswer
//         ? '✅ Corect!'
//         : '❌ Greșit! Răspunsul corect este: ' + this.question.correctAnswer;
//   }

//   nextQuestion() {
//     if (this.questions.length > 0) {
//       this.question = this.questions[Math.floor(Math.random() * this.questions.length)];
//       this.selectedAnswer = null;
//       this.result = null;
//     }
//   }
// }

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ⚠️ pentru [(ngModel)]
import { QuestionService } from '../../core/question.service';
import { QuestionDto } from '../../core/question.service';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent {
  constructor(private questionService: QuestionService) {}

  domains: string[] = ['test', 'test2'];
  selectedDomain: string = '';

  questions: QuestionDto[] = [];
  currentIndex = 0;
  question: QuestionDto | null = null;

  selectedAnswer: string | null = null;
  result: string | null = null;

  loadQuestions() {
    if (!this.selectedDomain) {
      alert('Selectează un domeniu!');
      return;
    }

    this.questionService.getQuestionsByDomain(this.selectedDomain).subscribe({
      next: (data) => {
        this.questions = data;
        this.currentIndex = 0;
        this.question = this.questions[this.currentIndex];
        this.result = null;
        this.selectedAnswer = null;
      },
      error: (err) => {
        console.error('Eroare la încărcarea întrebărilor:', err);
        alert('A apărut o eroare la încărcarea întrebărilor.');
      }
    });
  }

  selectAnswer(answer: string) {
    this.selectedAnswer = answer;
  }

  checkAnswer() {
    if (!this.selectedAnswer || !this.question) return;
    this.result =
      this.selectedAnswer === this.question.correctAnswer
        ? '✅ Corect!'
        : '❌ Greșit. Răspunsul corect este: ' + this.question.correctAnswer;
  }

  nextQuestion() {
    this.result = null;
    this.selectedAnswer = null;
    this.currentIndex++;

    if (this.currentIndex < this.questions.length) {
      this.question = this.questions[this.currentIndex];
    } else {
      this.question = null;
      alert('Ai terminat toate întrebările din acest domeniu 🎉');
    }
  }
}
