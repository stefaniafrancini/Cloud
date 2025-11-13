import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  error = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  onRegister() {
    this.error = '';

    if (!this.username || !this.password) {
      this.error = 'Usuario y contraseña son obligatorios.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }

    this.auth.register({
      username: this.username,
      email: this.email || undefined,
      password: this.password
    }).subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error(err);
        this.error =
          err.error?.detail ||
          'No se pudo crear la cuenta. Intentalo de nuevo.';
      }
    });
  }

  irALogin() {
    this.router.navigate(['/login']);
  }
}
