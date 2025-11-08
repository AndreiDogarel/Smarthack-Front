import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './auth.service';

export const canActivateAuth: CanActivateFn = () => {
  const pid = inject(PLATFORM_ID);
  if (!isPlatformBrowser(pid)) return true;
  const auth = inject(AuthService);
  if (auth.isAuthenticated()) return true;
  inject(Router).navigateByUrl('/login');
  return false;
};
