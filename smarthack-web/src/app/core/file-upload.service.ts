import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FileUploadService {
  private apiUrl = `${environment.apiBase}/materials/upload`;

  constructor(private http: HttpClient) {}

  uploadFile(file: File, domain: string): Observable<HttpEvent<any>> {
    const form = new FormData();
    form.append('file', file, file.name);
    form.append('domain', domain); // backend-ul tău citește @RequestParam("domain")

    const req = new HttpRequest('POST', this.apiUrl, form, {
      reportProgress: true
    });
    return this.http.request(req);
  }
}
