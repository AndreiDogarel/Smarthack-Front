import { ApplicationConfig, APP_INITIALIZER, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { authInterceptor } from './core/auth.interceptor';
import { provideClientHydration } from '@angular/platform-browser';
import { AuthService } from './core/auth.service';

function initAuthFactory() {
  return () => { inject(AuthService).init(); };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideClientHydration(),
    { provide: APP_INITIALIZER, multi: true, useFactory: initAuthFactory }
  ]
};
