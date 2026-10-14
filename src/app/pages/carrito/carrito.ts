import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { CarritoService } from '../../core/services/carrito.service';
import { ProductoService } from '../../core/services/producto.service';

@Component({ selector: 'app-carrito-page', standalone: true, imports: [CommonModule, RouterLink], templateUrl: './carrito.html', styleUrl: './carrito.css' })
export class CarritoPage implements OnInit {
  readonly carrito = inject(CarritoService);
  private readonly productos = inject(ProductoService);
  private readonly destroyRef = inject(DestroyRef);
  cargando = true;
  error = '';

  ngOnInit(): void {
    this.productos.obtenerProductosActuales().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (catalogo) => { this.carrito.sincronizarCatalogo(catalogo); this.cargando = false; },
      error: () => { this.error = 'No se pudo verificar el stock actual. Intenta de nuevo.'; this.cargando = false; },
    });
  }
}
