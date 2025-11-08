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

  ngOnInit() {
    if (isPlatformBrowser(this.pid) && this.auth.isAuthenticated()) {
      this.auth.me().subscribe(u => {
        if (u && u.username) this.user.set({ username: u.username, role: u.role });
      });
    }
  }

  logout() {
    this.auth.logout();
    if (isPlatformBrowser(this.pid)) location.href = '/login';
  }

  goToQuiz() {
    this.router.navigate(['/quiz']);
  }
  
  // goToSomething() {
  //   this.router.navigate(['/idk']);
  // }
}
