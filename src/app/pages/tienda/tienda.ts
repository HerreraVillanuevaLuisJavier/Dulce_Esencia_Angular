import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { Producto } from '../../core/models/producto.model';
import { CarritoService } from '../../core/services/carrito.service';
import { ProductoService } from '../../core/services/producto.service';

@Component({ selector: 'app-tienda-page', standalone: true, imports: [CommonModule, RouterLink], templateUrl: './tienda.html', styleUrl: './tienda.css' })
export class TiendaPage implements OnInit {
  private readonly productoService = inject(ProductoService);
  private readonly destroyRef = inject(DestroyRef);
  readonly carrito = inject(CarritoService);
  productos: Producto[] = [];
  cargando = true;
  error = '';
  aviso = '';

  ngOnInit(): void { this.cargarProductos(); }

  cargarProductos(): void {
    this.cargando = true; this.error = '';
    this.productoService.obtenerProductos().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (productos) => { this.productos = productos; this.carrito.sincronizarCatalogo(productos); this.cargando = false; },
      error: () => { this.cargando = false; this.error = 'No pudimos cargar el catálogo. Comprueba que JSON Server esté activo e inténtalo de nuevo.'; },
    });
  }

  agregar(producto: Producto): void {
    this.aviso = this.carrito.agregar(producto) ? `${producto.nombre} se añadió al carrito.` : `No hay más stock disponible de ${producto.nombre}.`;
  }
}
