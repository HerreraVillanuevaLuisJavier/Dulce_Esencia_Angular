import { DatePipe, LowerCasePipe, registerLocaleData } from '@angular/common';
import localeEsPe from '@angular/common/locales/es-PE';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

registerLocaleData(localeEsPe);

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [DatePipe, LowerCasePipe, RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class FooterComponent {
  readonly fechaActual = new Date();
}
