import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface QuestionDto {
  id: number;
  question: string;
  variantA: string;
  variantB: string;
  variantC: string;
  variantD: string;
  correctAnswer: string;
  domain: string;
}

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private apiUrl = 'http://localhost:8080/api/questions';

  constructor(private http: HttpClient) {}

  getQuestionsByDomain(domain: string): Observable<QuestionDto[]> {
    return this.http.get<QuestionDto[]>(`${this.apiUrl}/getQuestionsByDomain/${domain}`);
  }
}
