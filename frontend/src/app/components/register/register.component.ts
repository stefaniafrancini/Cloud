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
  errorUsername = '';
  errorEmail = '';


  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  onRegister() {
    this.error = '';
    this.errorUsername = '';
    this.errorEmail = '';


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
        const code = err.error?.code;
        const detail = err.error?.detail;

        if (code === 'username_exists') {
          this.errorUsername = detail || 'Ese usuario ya existe.';
        } else if (code === 'email_exists') {
          this.errorEmail = detail || 'Ese email ya está registrado.';
        } else {
          this.error =
            detail ||
            'No se pudo crear la cuenta. Intentalo de nuevo.';
        }
      }
    });
  }

  irALogin() {
    this.router.navigate(['/login']);
  }
}
