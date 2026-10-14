import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginPage {
  readonly authService = inject(AuthService);
  readonly router = inject(Router);

  email = 'cliente@dulceesencia.com';
  password = 'Dulce123!';
  showPassword = false;
  errorMessage = '';

  login(formulario: NgForm): void {
    this.errorMessage = '';

    if (formulario.invalid) {
      formulario.control.markAllAsTouched();
      return;
    }

    const isValid = this.authService.login(this.email, this.password);

    if (!isValid) {
      this.errorMessage = 'Credenciales incorrectas. Intenta nuevamente.';
      return;
    }

    this.errorMessage = '';
    this.router.navigateByUrl('/dashboard');
  }
}
