import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-ofertas-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './ofertas.html',
  styleUrl: './ofertas.css',
})
export class OfertasPage {}
