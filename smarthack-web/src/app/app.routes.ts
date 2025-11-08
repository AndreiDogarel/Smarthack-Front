import { Routes } from '@angular/router';
import { canActivateAuth } from './core/auth.guard';
import { canMatchPublic } from './core/public.guard';
import { QuizComponent } from './pages/quiz/quiz.component';
import { ProfesorQuiz } from './pages/profesor-quiz/profesor-quiz';

export const appRoutes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent), canActivate: [canActivateAuth] },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent), canMatch: [canMatchPublic] },
  { path: 'register', loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent), canMatch: [canMatchPublic] },
  { path: 'quiz', component: QuizComponent },
  {path: 'professor-dashboard', component: ProfesorQuiz},
  { path: '**', redirectTo: '' },
];
