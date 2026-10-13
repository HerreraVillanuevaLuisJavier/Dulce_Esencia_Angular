import { CommonModule, UpperCasePipe, registerLocaleData } from '@angular/common';
import localeEsPe from '@angular/common/locales/es-PE';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { Producto } from '../../core/models/producto.model';
import { ProductoService } from '../../core/services/producto.service';

registerLocaleData(localeEsPe);

@Component({
  selector: 'app-ofertas-page',
  standalone: true,
  imports: [CommonModule, RouterLink, UpperCasePipe],
  templateUrl: './ofertas.html',
  styleUrl: './ofertas.css',
})
export class OfertasPage implements OnInit {
  private readonly productoService = inject(ProductoService);
  private readonly destroyRef = inject(DestroyRef);

  productos: Producto[] = [];
  cargando = true;
  error = '';
  readonly imagenesFallidas = new Set<number>();

  ngOnInit(): void {
    this.cargarProductos();
  }

  get productosEnOferta(): Producto[] {
    return this.productos.filter((producto) => {
      const unidadesNecesarias = producto.oferta?.tipo === '2x1' ? 2 : 1;
      return producto.oferta && producto.stock >= unidadesNecesarias;
    });
  }

  cargarProductos(): void {
    this.cargando = true;
    this.error = '';

    this.productoService
      .obtenerProductos()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (productos) => {
          this.productos = productos;
          this.imagenesFallidas.clear();
          this.cargando = false;
        },
        error: () => {
          this.productos = [];
          this.cargando = false;
          this.error = 'No pudimos cargar las ofertas. Comprueba que JSON Server esté activo e inténtalo de nuevo.';
        },
      });
  }

  descripcionOferta(producto: Producto): string {
    if (!producto.oferta) return '';
    return producto.oferta.tipo === 'porcentaje'
      ? `${producto.oferta.porcentaje}% de descuento`
      : 'Lleva 2 y paga 1';
  }

  precioOriginalOferta(producto: Producto): number {
    return producto.oferta?.tipo === '2x1' ? producto.precio * 2 : producto.precio;
  }

  montoDescuento(producto: Producto): number {
    if (producto.oferta?.tipo === 'porcentaje') {
      return this.redondear(producto.precio * producto.oferta.porcentaje / 100);
    }
    return producto.oferta?.tipo === '2x1' ? producto.precio : 0;
  }

  precioFinalOferta(producto: Producto): number {
    return this.redondear(this.precioOriginalOferta(producto) - this.montoDescuento(producto));
  }

  trackById(_index: number, producto: Producto): number {
    return producto.id;
  }

  marcarImagenFallida(productoId: number): void {
    this.imagenesFallidas.add(productoId);
  }

  private redondear(importe: number): number {
    return Math.round((importe + Number.EPSILON) * 100) / 100;
  }
}
