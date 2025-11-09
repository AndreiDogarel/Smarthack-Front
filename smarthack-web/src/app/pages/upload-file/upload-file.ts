import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { FileUploadService } from '../../core/file-upload.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

type QuizDtoIn = { question: string; options: string[]; answer_index?: number; answerIndex?: number; hint?: string };
type ModelResponse = { filename?: string; domain?: string; summary: string; saved_questions?: number; quizzes: QuizDtoIn[] };
type QuizView = { id: number; question: string; options: string[]; answerIndex: number; hint?: string };

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './upload-file.html',
  styleUrls: ['./upload-file.css']
})
export class FileUploadComponent {
  private router = inject(Router);
  constructor(private uploadService: FileUploadService) {}

  domains = ['Matematică','Istorie','Geografie','Biologie','Literatură'];
  selectedDomain: string | null = null;
  selectedFile: File | null = null;

  uploadProgress = 0;
  message = '';
  isUploading = false;

  data: { summary: string; quizzes: QuizView[]; saved?: number; filename?: string; domain?: string } | null = null;

  // selecții
  selected: Record<number, number> = {};
  selectedCurrent: number | null = null;

  // slider
  current = 0;
  touchStartX = 0;
  touchStartY = 0;
  isAnimating = false;

  get total(): number { return this.data?.quizzes.length ?? 0; }
  get currentQ() { return this.data?.quizzes[this.current]; }

  private syncSelection() {
    const q = this.currentQ;
    this.selectedCurrent = q ? (this.selected[q.id] ?? null) : null;
  }
  private resetQuizState() {
    this.current = 0;
    this.selected = {};
    this.selectedCurrent = null;
    this.isAnimating = false;
  }

  next() {
    if (!this.data) return;
    if (this.current < this.total - 1) {
      this.current++;
      this.syncSelection();
      this.bump();
    }
  }
  prev() {
    if (!this.data) return;
    if (this.current > 0) {
      this.current--;
      this.syncSelection();
      this.bump();
    }
  }
  goTo(i: number) {
    if (!this.data) return;
    if (i >= 0 && i < this.total) {
      this.current = i;
      this.syncSelection();
      this.bump();
    }
  }

  choose(qid: number, idx: number) {
    this.selected[qid] = idx;
    this.selectedCurrent = idx;
  }

  onKey(e: KeyboardEvent) {
    if (e.key === 'ArrowRight') this.next();
    if (e.key === 'ArrowLeft') this.prev();
  }
  onTouchStart(e: TouchEvent) {
    const t = e.changedTouches[0];
    this.touchStartX = t.clientX;
    this.touchStartY = t.clientY;
  }
  onTouchEnd(e: TouchEvent) {
    const t = e.changedTouches[0];
    const dx = t.clientX - this.touchStartX;
    const dy = t.clientY - this.touchStartY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      if (dx < 0) this.next(); else this.prev();
    }
  }
  bump() {
    this.isAnimating = true;
    setTimeout(() => (this.isAnimating = false), 120);
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files?.[0] ?? null;
    this.message = '';
    this.data = null;
    this.uploadProgress = 0;
    this.resetQuizState();
  }

  onUpload() {
    if (!this.selectedFile || !this.selectedDomain) {
      this.message = 'Selectează fișier și domeniu.';
      return;
    }
    this.isUploading = true;
    this.uploadProgress = 0;
    this.message = '';

    this.uploadService.uploadFile(this.selectedFile, this.selectedDomain).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round((100 * event.loaded) / event.total);
        }
        if (event.type === HttpEventType.Response) {
          const body = event.body as ModelResponse | string | null;
          const parsed = typeof body === 'string' ? this.safeJson(body) : body;
          if (!parsed) {
            this.message = 'Răspuns invalid de la server.';
            this.isUploading = false;
            return;
          }
          const quizzes: QuizView[] = (parsed.quizzes ?? []).map((q, i) => ({
            id: i + 1,
            question: q.question,
            options: q.options ?? [],
            answerIndex: q.answerIndex ?? q.answer_index ?? 0,
            hint: q.hint
          }));
          this.data = {
            summary: parsed.summary ?? '',
            quizzes,
            saved: parsed.saved_questions,
            filename: parsed.filename,
            domain: parsed.domain ?? this.selectedDomain ?? undefined
          };
          this.resetQuizState();     // deselectează la prima întrebare
          this.syncSelection();      // sincronizează starea locală a selecției
          this.isUploading = false;
        }
      },
      error: () => {
        this.isUploading = false;
        this.message = 'Eroare la încărcare.';
      }
    });
  }

  // corect/greșit bazat pe selecția întrebării active (fallback pe selected[q.id] dacă e altă instanță)
  isCorrect(q: QuizView, idx: number) {
    const sel = (this.currentQ?.id === q.id) ? this.selectedCurrent : this.selected[q.id];
    return sel === idx && idx === q.answerIndex;
  }
  isWrong(q: QuizView, idx: number) {
    const sel = (this.currentQ?.id === q.id) ? this.selectedCurrent : this.selected[q.id];
    return sel === idx && idx !== q.answerIndex;
  }

  goHome() {
    this.router.navigate(['/']);
  }

  formatSummary(text: string): string {
    return text ? text.replace(/\n/g, '<br/>') : '';
  }

  private safeJson(s: string | null) {
    try { return s ? JSON.parse(s) as ModelResponse : null; } catch { return null; }
  }
}
