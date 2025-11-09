import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuestionService, QuestionDto, QuestionDtoAdd } from '../../core/question.service';
@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profesor-quiz.html',
  styleUrls: ['./profesor-quiz.css']
})
export class ProfesorQuiz {
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
    if (!this.selectedDomain || !this.userInput || !this.variantaA || !this.variantaB || !this.variantaC || !this.variantaD || !this.variantaCorecta) {
      alert('Nu poti sa lași câmpuri goale!');
      return;
    }

    const dto: QuestionDtoAdd = {
      question: this.userInput,
      variantA: this.variantaA,
      variantB: this.variantaB,
      variantC: this.variantaC,
      variantD: this.variantaD,
      correctAnswer: this.variantaCorecta,
      domain: this.selectedDomain
    };

    console.log('📦 Trimit la backend:', dto);

    this.questionService.addQuestion(dto).subscribe({
      next: () => {
        alert('✅ Întrebarea a fost adăugată cu succes!');
        this.resetFields();
      },
      error: (err) => {
        console.error('❌ Eroare la trimitere:', err);
        alert('A apărut o eroare la trimiterea întrebării.');
      }
    });


  
  }

  resetFields() {
    this.userInput = '';
    this.variantaA = '';
    this.variantaB = '';
    this.variantaC = '';
    this.variantaD = '';
    this.variantaCorecta = '';
    this.selectedDomain = '';
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

