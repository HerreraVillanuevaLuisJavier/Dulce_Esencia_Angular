import { CommonModule, registerLocaleData } from '@angular/common';
import localeEsPe from '@angular/common/locales/es-PE';
import { Component, DestroyRef, HostListener, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CategoriaProducto, Producto } from '../../core/models/producto.model';
import { ProductoService } from '../../core/services/producto.service';

registerLocaleData(localeEsPe);

@Component({
  selector: 'app-productos-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class ProductosPage implements OnInit {
  private readonly productoService = inject(ProductoService);
  private readonly destroyRef = inject(DestroyRef);

  readonly categorias: CategoriaProducto[] = ['Tortas', 'Cupcakes', 'Cheesecakes', 'Cajas de postres'];
  productos: Producto[] = [];
  cargando = true;
  error = '';
  busqueda = '';
  categoriaSeleccionada: CategoriaProducto | '' = '';
  readonly imagenesFallidas = new Set<number>();
  productoSeleccionado: Producto | null = null;

  ngOnInit(): void {
    this.cargarProductos();
  }

  get productosFiltrados(): Producto[] {
    const termino = this.busqueda.trim().toLocaleLowerCase('es-PE');

    return this.productos.filter((producto) => {
      const coincideNombre = producto.nombre.toLocaleLowerCase('es-PE').includes(termino);
      const coincideCategoria = !this.categoriaSeleccionada || producto.categoria === this.categoriaSeleccionada;
      return coincideNombre && coincideCategoria;
    });
  }

  get stockMaximo(): number {
    return Math.max(0, ...this.productos.map((producto) => producto.stock));
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
          this.error = 'No pudimos cargar el catálogo. Comprueba que JSON Server esté activo e inténtalo de nuevo.';
        },
      });
  }

  limpiarFiltros(): void {
    this.busqueda = '';
    this.categoriaSeleccionada = '';
  }

  verDetalles(producto: Producto): void {
    this.productoSeleccionado = producto;
  }

  cerrarDetalles(): void {
    this.productoSeleccionado = null;
  }

  cerrarSiFondo(evento: MouseEvent): void {
    if (evento.target === evento.currentTarget) this.cerrarDetalles();
  }

  @HostListener('document:keydown.escape')
  cerrarConEscape(): void {
    this.cerrarDetalles();
  }

  marcarImagenFallida(productoId: number): void {
    this.imagenesFallidas.add(productoId);
  }

  porcentajeStock(stock: number): number {
    const stockMaximo = Math.max(1, ...this.productos.map((producto) => producto.stock));
    return Math.min((stock / stockMaximo) * 100, 100);
  }

  trackById(_index: number, producto: Producto): number {
    return producto.id;
  }
}
