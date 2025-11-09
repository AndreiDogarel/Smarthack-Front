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


import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { QuestionService, QuestionDto } from '../../core/question.service';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent {
  private router = inject(Router);
  userInput: string = '';
  variantaA: string = '';
  variantaB: string = '';
  variantaC: string = '';
  variantaD: string = '';
  variantaCorecta: string = '';
  constructor(private questionService: QuestionService) {}

  // 🔹 Domenii disponibile
  domains: string[] = ['Matematică', 'Istorie', 'Geografie', 'Biologie', 'Literatură'];
  selectedDomain: string = '';

  // 🔹 Stări interne
  questions: QuestionDto[] = [];
  currentIndex = 0;
  question: QuestionDto | null = null;
  selectedAnswer: string | null = null;
  result: string | null = null;
  loading: boolean = false; // 👉 pentru mesajul „Se încarcă întrebarea...”
  showQuestion: boolean = false; // 👉 pentru animația de apariție a întrebării

  // 🔹 Încarcă întrebările
  loadQuestions() {
    if (!this.selectedDomain) {
      alert('Selectează un domeniu!');
      return;
    }
    

    this.loading = true;
    this.showQuestion = false;
    this.questions = [];
    this.question = null;
    this.result = null;
    this.selectedAnswer = null;

    this.questionService.getQuestionsByDomain(this.selectedDomain).subscribe({
      next: (data) => {
        setTimeout(() => {
          this.questions = data;
          this.currentIndex = 0;

          if (this.questions.length > 0) {
            this.question = this.questions[this.currentIndex];
            this.loading = false;

            // 🔸 dăm o mică întârziere pentru ca fade-in să fie vizibil
            setTimeout(() => {
              this.showQuestion = true;
            }, 100);
          } else {
            this.loading = false;
            alert('Nu există întrebări pentru acest domeniu.');
          }
        }, 1000); // simulăm un mic delay pentru animația de încărcare
      },
      error: (err) => {
        console.error('Eroare la încărcarea întrebărilor:', err);
        alert('A apărut o eroare la încărcarea întrebărilor.');
        this.loading = false;
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
        : `❌ Greșit. Răspunsul corect este: ${this.question.correctAnswer}`;
  }

  nextQuestion() {
    this.result = null;
    this.selectedAnswer = null;
    this.showQuestion = false;

    setTimeout(() => {
      this.currentIndex++;

      if (this.currentIndex < this.questions.length) {
        this.question = this.questions[this.currentIndex];

        // fade-in pentru următoarea întrebare
        setTimeout(() => {
          this.showQuestion = true;
        }, 150);
      } else {
        this.question = null;
        alert('Ai terminat toate întrebările din acest domeniu 🎉');
      }
    }, 300);
  }
  isProfessor(): boolean {
    return true;
  }
  isStudent(): boolean {
    return false;
  }
  goHome() {
    this.router.navigate(['/']); // navighează către Home
  }
}


