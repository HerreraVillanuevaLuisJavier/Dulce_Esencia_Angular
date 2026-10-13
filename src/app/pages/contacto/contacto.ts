import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-contacto-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contacto.html',
  styleUrl: './contacto.css',
})
export class ContactoPage {
  nombre = '';
  correo = '';
  asunto = '';
  mensaje = '';
  confirmacion = '';

  enviarMensaje(formulario: NgForm): void {
    this.confirmacion = '';

    if (formulario.invalid) {
      formulario.control.markAllAsTouched();
      return;
    }

    this.confirmacion = '¡Gracias por escribirnos! Tu mensaje se ha procesado correctamente en esta demostración. No se envió a un servidor.';
    formulario.resetForm();
  }
}
