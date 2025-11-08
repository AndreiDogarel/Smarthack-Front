import { Component, inject, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';
@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  private auth = inject(AuthService);
  private pid = inject(PLATFORM_ID);
  user = signal<{username:string;role:string}|null>(null);
  private router = inject(Router);
  private authService = inject(AuthService);

  loggeninUser = this.authService.getUser(); // sau however obții userul

  isStudent(): boolean {
    console.log('User role:', this.loggeninUser?.role);
    return this.loggeninUser?.role === 'STUDENT';
  }

  isProfessor(): boolean {
    return this.loggeninUser?.role === 'PROFESOR';
  }


  ngOnInit() {
    if (isPlatformBrowser(this.pid) && this.auth.isAuthenticated()) {
      const u = this.auth.getUser();
      if (u && u.username) {
        this.user.set({ username: u.username, role: u.role });
      }
    }
  }

  logout() {
    this.auth.logout();
    if (isPlatformBrowser(this.pid)) location.href = '/login';
  }

  goToQuiz() {
    if (this.isProfessor()) {
      this.router.navigate(['/professor-dashboard']);
    } else {
    this.router.navigate(['/quiz']);
    }
  }

   openAbout() {
    this.router.navigate(['/about_app']); // navighează către AboutComponent
  }

  // goToSomething() {
  //   this.router.navigate(['/idk']);
  // }
}
