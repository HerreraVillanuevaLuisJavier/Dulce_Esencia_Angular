import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-mi-cuenta-page',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './mi-cuenta.html',
  styleUrl: './mi-cuenta.css',
})
export class MiCuentaPage {
  readonly authService = inject(AuthService);
  readonly router = inject(Router);
  email = '';
  password = '';
  errorMessage = '';

  loginCliente(formulario: NgForm): void {
    this.errorMessage = '';
    if (formulario.invalid) {
      formulario.control.markAllAsTouched();
      return;
    }

    if (!this.authService.loginCliente(this.email, this.password)) {
      this.errorMessage = 'No se pudo validar la cuenta de cliente. Revisa tus datos e inténtalo nuevamente.';
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }
}
