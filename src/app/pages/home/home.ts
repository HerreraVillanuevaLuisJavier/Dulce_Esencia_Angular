import { CommonModule, registerLocaleData } from '@angular/common';
import localeEsPe from '@angular/common/locales/es-PE';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { Producto } from '../../core/models/producto.model';
import { ProductoService } from '../../core/services/producto.service';

registerLocaleData(localeEsPe);

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomePage implements OnInit {
  private readonly productoService = inject(ProductoService);
  private readonly destroyRef = inject(DestroyRef);

  productos: Producto[] = [];
  cargandoProductos = true;
  errorProductos = '';
  readonly imagenesFallidas = new Set<number>();

  ngOnInit(): void {
    this.cargarProductos();
  }

  get productosDestacados(): Producto[] {
    return this.productos.filter((producto) => producto.stock > 0).slice(0, 3);
  }

  get promocionesDestacadas(): Producto[] {
    const descuentoTorta = this.productos.find(
      (producto) => producto.oferta?.tipo === 'porcentaje' && producto.stock > 0,
    );
    const ofertaDosPorUno = this.productos.find(
      (producto) => producto.oferta?.tipo === '2x1' && producto.stock >= 2,
    );

    return [descuentoTorta, ofertaDosPorUno].filter((producto): producto is Producto => producto !== undefined);
  }

  cargarProductos(): void {
    this.cargandoProductos = true;
    this.errorProductos = '';

    this.productoService
      .obtenerProductos()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (productos) => {
          this.productos = productos;
          this.imagenesFallidas.clear();
          this.cargandoProductos = false;
        },
        error: () => {
          this.productos = [];
          this.cargandoProductos = false;
          this.errorProductos = 'No pudimos cargar los productos destacados. Comprueba que JSON Server esté activo.';
        },
      });
  }

  descripcionOferta(producto: Producto): string {
    if (!producto.oferta) return '';
    return producto.oferta.tipo === 'porcentaje'
      ? `${producto.oferta.porcentaje}% de descuento en tortas`
      : '2x1 en cupcakes';
  }

  marcarImagenFallida(productoId: number): void {
    this.imagenesFallidas.add(productoId);
  }

  trackById(_index: number, producto: Producto): number {
    return producto.id;
  }
}
