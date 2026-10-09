import { Component } from '@angular/core';

@Component({
  selector: 'app-productos-page',
  standalone: true,
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class ProductosPage {
  readonly productos = [
    { nombre: 'Torta de chocolate', categoria: 'Tortas', precio: 'S/ 65.00', descripcion: 'Cobertura cremosa y textura intensa, perfecta para celebraciones.', imagen: '/images/pastel-chocolate.jpg' },
    { nombre: 'Torta de vainilla', categoria: 'Tortas', precio: 'S/ 60.00', descripcion: 'Bizcocho suave con relleno ligero y un aroma delicado.', imagen: '/images/torta-vainilla.jpg' },
    { nombre: 'Cheesecake de frutos rojos', categoria: 'Cheesecakes', precio: 'S/ 72.00', descripcion: 'Base cremosa con un toque ácido y dulce muy equilibrado.', imagen: '/images/cheesecake-frutos-rojos.jpg' },
    { nombre: 'Cupcakes de chocolate', categoria: 'Cupcakes', precio: 'S/ 28.00', descripcion: 'Mordidas suaves, sabrosas y decoradas al detalle.', imagen: '/images/cupcakes-chocolate.jpg' },
    { nombre: 'Cupcakes de vainilla', categoria: 'Cupcakes', precio: 'S/ 26.00', descripcion: 'Estilo clásico para compartir en reuniones encantadoras.', imagen: '/images/cupcakes-vainilla.jpg' },
    { nombre: 'Box dulce especial', categoria: 'Boxes dulces', precio: 'S/ 48.00', descripcion: 'Selección especial para regalar o disfrutar en compañía.', imagen: '/images/productos.jpg' },
  ];
}
