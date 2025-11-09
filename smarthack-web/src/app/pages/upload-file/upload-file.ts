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
  domains = ['Matematică','Istorie','Geografie','Biologie','Literatură'];
  selectedDomain: string | null = null;
  selectedFile: File | null = null;
  uploadProgress = 0;
  message = '';
  data: { summary: string; quizzes: QuizView[]; saved?: number; filename?: string; domain?: string } | null = null;
  selected: Record<number, number> = {};

  constructor(private uploadService: FileUploadService) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files?.[0] ?? null;
    this.message = '';
    this.data = null;
    this.selected = {};
    this.uploadProgress = 0;
  }

  onUpload() {
    if (!this.selectedFile || !this.selectedDomain) {
      this.message = 'Selectează fișier și domeniu.';
      return;
    }
    this.uploadService.uploadFile(this.selectedFile, this.selectedDomain).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round((100 * event.loaded) / event.total);
        } else if (event.type === HttpEventType.Response) {
          const body = event.body as ModelResponse | string | null;
          const parsed = typeof body === 'string' ? this.safeJson(body) : body;
          if (!parsed) {
            this.message = 'Răspuns invalid de la server.';
            this.resetAfterUpload();
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
            domain: parsed.domain
          };
          this.resetAfterUpload();
        }
      },
      error: () => {
        this.message = 'Eroare la upload.';
        this.resetAfterUpload();
      }
    });
  }

  choose(qid: number, idx: number) {
    this.selected[qid] = idx;
  }

  isCorrect(q: QuizView, idx: number) {
    return this.selected[q.id] === idx && idx === q.answerIndex;
  }

  isWrong(q: QuizView, idx: number) {
    return this.selected[q.id] === idx && idx !== q.answerIndex;
  }

  goHome() {
    this.router.navigate(['/']);
  }

  formatSummary(text: string): string {
    return text ? text.replace(/\n/g, '<br/>') : '';
  }

  private resetAfterUpload() {
    this.uploadProgress = 0;
    this.selectedFile = null;
  }

  private safeJson(s: string | null) {
    try { return s ? JSON.parse(s) as ModelResponse : null; } catch { return null; }
  }
}
