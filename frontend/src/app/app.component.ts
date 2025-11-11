import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NgIf } from '@angular/common';   // ⬅️ NECESARIO para *ngIf

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NgIf],  // ⬅️ agrega NgIf
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'front2';
  showNavbar = true;
  private authRoutes = ['/login', '/register', '/forgot'];

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        const current = e.urlAfterRedirects || e.url;
        this.showNavbar = !this.authRoutes.some(r => current.startsWith(r));
      });
  }
}
