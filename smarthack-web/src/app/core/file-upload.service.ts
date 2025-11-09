import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FileUploadService {
  private apiUrl = `${environment.apiBase}/materials/upload`;

  constructor(private http: HttpClient) {}

  uploadFile(file: File): Observable<HttpEvent<any>> {
    const formData = new FormData();
    formData.append('file', file);

    const req = new HttpRequest('POST', this.apiUrl, formData, {
      reportProgress: true,
      responseType: 'text'
    });

    return this.http.request(req);
  }
}
