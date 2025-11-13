import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-forgot',
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css']
})
export class ForgotComponent {
  username = '';
  email = '';
  newPassword = '';
  confirmPassword = '';
  error = '';
  success = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    this.error = '';
    this.success = '';

    if (!this.username && !this.email) {
      this.error = 'Ingresá tu usuario o tu email.';
      return;
    }

    if (!this.newPassword) {
      this.error = 'Ingresá la nueva contraseña.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }

    this.auth.forgotPassword({
      username: this.username || undefined,
      email: this.email || undefined,
      new_password: this.newPassword
    }).subscribe({
      next: (res) => {
        this.success = res.detail || 'Contraseña actualizada.';
        // opcional: ir al login directo
      },
      error: (err) => {
        console.error(err);
        this.error = err.error?.detail || 'No se pudo resetear la contraseña.';
      }
    });
  }

  irALogin() {
    this.router.navigate(['/login']);
  }
}
