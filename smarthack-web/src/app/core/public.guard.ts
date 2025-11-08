import { CanMatchFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const canMatchPublic: CanMatchFn = () => {
  const auth = inject(AuthService);
  if (auth.isAuthenticated()) { inject(Router).navigateByUrl('/'); return false; }
  return true;
};
