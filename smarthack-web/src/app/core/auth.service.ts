import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { LoginRequest, LoginResponse, RegisterRequest, UserProfile } from './models';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { safeStorage } from './safe-storage';
import { isJwtExpired } from './jwt';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private key = 'jwt';

  login(body: { username: string; password: string }) {
    return this.http.post(`${environment.apiBase}/auth/login`, body, {
      responseType: 'text' as const,
      observe: 'response'
    }).pipe(
      map(res => {
        const raw = res.body ?? '';
        if (typeof raw !== 'string') throw new Error('Missing token');
        if (raw.startsWith('eyJ')) return raw;
        try {
          const obj = JSON.parse(raw);
          if (obj && typeof obj.token === 'string') return obj.token;
        } catch {}
        throw new Error('Missing token');
      }),
      tap(token => safeStorage.set('jwt', token))
    );
  }

  register(body: RegisterRequest) {
    console.log('Registering user with body:', body);
    return this.http.post<UserProfile>(`${environment.apiBase}/auth/register`, body);
  }

  me(): Observable<UserProfile> {
    const token = safeStorage.get(this.key);
    if (!token) return of({ id: 0, username: '', role: '' } as any);
    return this.http.get<UserProfile>(`${environment.apiBase}/auth/me`);
  }

  token(): string | null {
    return safeStorage.get(this.key);
  }

  logout() {
    safeStorage.remove(this.key);
  }

  isAuthenticated(): boolean {
    const t = this.token();
    if (!t) return false;
    if (t.length < 10 || !t.includes('.') || isJwtExpired(t)) { this.logout(); return false; }
    return true;
  }
  init(): void {
    const t = this.token();
    if (t && isJwtExpired(t)) this.logout();
  }
}
