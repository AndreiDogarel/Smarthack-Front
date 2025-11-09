import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class HintService {
  private apiUrl = `${environment.apiBase}/ai/hint`;

  constructor(private http: HttpClient) {}

  getHint(question: String): Observable<any> {
    return this.http.post(this.apiUrl, { question });
    // const formData = new FormData();
    // formData.append('question', question.toString());

    // const req = new HttpRequest('POST', this.apiUrl, formData, {
    //   reportProgress: true,
    //   responseType: 'text'
    // });

    // return this.http.request(req);
    
  }
}
