import { HttpInterceptorFn } from '@angular/common/http';
import { safeStorage } from './safe-storage';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes('/auth/login') || req.url.includes('/auth/register')) return next(req);
  const token = safeStorage.get('jwt');
  if (token) req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  return next(req);
};
