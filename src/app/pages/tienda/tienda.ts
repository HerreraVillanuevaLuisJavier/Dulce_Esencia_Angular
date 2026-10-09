import { Component } from '@angular/core';

@Component({
  selector: 'app-tienda-page',
  standalone: true,
  templateUrl: './tienda.html',
  styleUrl: './tienda.css',
})
export class TiendaPage {
  readonly productos = [
    { nombre: 'Torta de cumpleaños', descripcion: 'Diseño premium con sabores irresistibles.', precio: 'S/ 95.00', imagen: '/images/torta-principal.jpeg' },
    { nombre: 'Cupcake sampler', descripcion: 'Caja con variedad de cupcakes artesanales.', precio: 'S/ 42.00', imagen: '/images/cupcakes-vainilla.jpg' },
    { nombre: 'Box de postres', descripcion: 'Selección para eventos y regalos especiales.', precio: 'S/ 58.00', imagen: '/images/productos.jpg' },
  ];
}
