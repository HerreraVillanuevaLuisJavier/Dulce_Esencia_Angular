import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomePage {
  readonly productos = [
    { id: 'torta-chocolate', nombre: 'Torta de chocolate', descripcion: 'Torta artesanal de chocolate con cobertura cremosa.', categoria: 'Tortas', precio: 'S/ 65.00', imagen: '/images/pastel-chocolate.jpg' },
    { id: 'torta-vainilla', nombre: 'Torta de vainilla', descripcion: 'Bizcocho suave de vainilla con relleno delicado.', categoria: 'Tortas', precio: 'S/ 60.00', imagen: '/images/torta-vainilla.jpg' },
    { id: 'cheesecake-frutos-rojos', nombre: 'Cheesecake de frutos rojos', descripcion: 'Cheesecake cremoso con frutos rojos de temporada.', categoria: 'Cheesecakes', precio: 'S/ 72.00', imagen: '/images/cheesecake-frutos-rojos.jpg' },
    { id: 'cupcakes-chocolate', nombre: 'Cupcakes de chocolate', descripcion: 'Cupcakes esponjosos de chocolate con frosting artesanal.', categoria: 'Cupcakes', precio: 'S/ 28.00', imagen: '/images/cupcakes-chocolate.jpg' },
    { id: 'cupcakes-vainilla', nombre: 'Cupcakes de vainilla', descripcion: 'Cupcakes de vainilla decorados para cualquier celebración.', categoria: 'Cupcakes', precio: 'S/ 26.00', imagen: '/images/cupcakes-vainilla.jpg' },
    { id: 'box-dulce', nombre: 'Box dulce especial', descripcion: 'Selección de bocados dulces para compartir y regalar.', categoria: 'Boxes dulces', precio: 'S/ 48.00', imagen: '/images/productos.jpg' },
  ];
}
