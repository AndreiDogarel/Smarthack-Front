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

  // login(body: { username: string; password: string }) {
  //   return this.http.post(`${environment.apiBase}/auth/login`, body, {
  //     responseType: 'text' as const,
  //     observe: 'response'
  //   }).pipe(
  //     map(res => {
  //       const raw = res.body ?? '';
  //       if (typeof raw !== 'string') throw new Error('Missing token');
  //       if (raw.startsWith('eyJ')) return raw;
  //       try {
  //         const obj = JSON.parse(raw);
  //         if (obj && typeof obj.token === 'string') return obj.token;
  //       } catch {}
  //       throw new Error('Missing token');
  //     }),
  //     tap(token => {safeStorage.set('jwt', token)
  //         console.log('Stored JWT token:', token);
  //     })
  //   );
  // }
  login(body: { username: string; password: string }) {
    return this.http.post(`${environment.apiBase}/auth/login`, body, {
      responseType: 'text' as const,
      observe: 'response'
    }).pipe(
      tap(res => console.log('Raw login HTTP response:', res)),
      map(res => {
        const raw = res.body ?? '';
        console.log('Raw response body:', raw);
  
        if (typeof raw !== 'string') throw new Error('Missing token');
        if (raw.startsWith('eyJ')) return raw;
  
        try {
          const obj = JSON.parse(raw);
          if (obj && typeof obj.token === 'string') return obj.token;
        } catch (err) {
          console.error('Failed to parse as JSON:', err);
        }
  
        throw new Error('Missing token');
      }),
      tap(token => {
        console.log('Token primit la login:', token);
        safeStorage.set('jwt', token);
      })
    );
  }
  

  register(body: RegisterRequest) {
    console.log('Registering user with body:', body);
    return this.http.post<UserProfile>(`${environment.apiBase}/auth/register`, body);
  }

  // me(): Observable<UserProfile> {
  //   const token = safeStorage.get(this.key);
  //   if (!token) return of({ id: 0, username: '', role: '' } as any);
  //   return this.http.get<UserProfile>(`${environment.apiBase}/auth/me`);
  // }

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
  // getUser(): UserProfile | null {
  //   console.log('Getting user from token');
  //   console.log('Current token:', this.token());
  //   const token = this.token();
  //   if (!token) return null;
  
  //   try {
  //     const payload = JSON.parse(atob(token.split('.')[1])); // decode JWT payload
  //     return {
  //       id: payload.id ?? 0,
  //       username: payload.sub ?? payload.username ?? '',
  //       role: payload.role ?? ''
  //     };
  //   } catch (e) {
  //     console.error('Failed to decode token', e);
  //     return null;
  //   }
  // }
  getUser(): UserProfile | null {
    const token = this.token();
    if (!token) return null;
  
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Decoded payload:', payload);
  
      // dacă "role" este un obiect, extrage numele
      const role = typeof payload.role === 'object'
        ? payload.role.name
        : payload.role ?? '';
  
      return {
        id: payload.id ?? 0,
        username: payload.sub ?? payload.username ?? '',
        role
      };
    } catch (e) {
      console.error('Failed to decode token', e);
      return null;
    }
  }
  
}
