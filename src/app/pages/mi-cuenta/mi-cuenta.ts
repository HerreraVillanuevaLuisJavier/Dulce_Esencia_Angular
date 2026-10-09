import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-mi-cuenta-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './mi-cuenta.html',
  styleUrl: './mi-cuenta.css',
})
export class MiCuentaPage {
  readonly authService = inject(AuthService);
}
