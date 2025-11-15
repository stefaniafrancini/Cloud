import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NgIf } from '@angular/common';
import { ChatbotComponent } from './shared/chatbot/chatbot.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NgIf, ChatbotComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'front2';

  showNavbar = true;
  showChatbot = true;

  // Rutas donde NO se muestra navbar ni chatbot
  private authRoutes = ['/login', '/register', '/forgot'];

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        const current = e.urlAfterRedirects || e.url;

        const isAuthRoute = this.authRoutes.some(r => current.startsWith(r));

        this.showNavbar = !isAuthRoute;
        this.showChatbot = !isAuthRoute;
      });
  }
}
