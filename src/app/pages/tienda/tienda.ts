import { CommonModule, registerLocaleData } from '@angular/common';
import localeEsPe from '@angular/common/locales/es-PE';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, NgForm } from '@angular/forms';
import { Producto } from '../../core/models/producto.model';
import { ProductoService } from '../../core/services/producto.service';

registerLocaleData(localeEsPe);

@Component({
  selector: 'app-tienda-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tienda.html',
  styleUrl: './tienda.css',
})
export class TiendaPage implements OnInit {
  private readonly productoService = inject(ProductoService);
  private readonly destroyRef = inject(DestroyRef);

  productos: Producto[] = [];
  cargando = true;
  error = '';
  productoSeleccionadoId: number | null = null;
  nombreCliente = '';
  correoCliente = '';
  cantidad = 1;
  tipoPedido = '';
  errorFormulario = '';
  confirmacionSolicitud = '';

  get productoSeleccionado(): Producto | undefined {
    return this.productosDisponibles.find((producto) => producto.id === this.productoSeleccionadoId);
  }

  get esCantidadEntera(): boolean {
    return Number.isInteger(this.cantidad);
  }

  ngOnInit(): void {
    this.cargarProductos();
  }

  get productosDisponibles(): Producto[] {
    return this.productos.filter((producto) => producto.stock > 0);
  }

  cargarProductos(): void {
    this.cargando = true;
    this.error = '';
    this.errorFormulario = '';

    this.productoService
      .obtenerProductos()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (productos) => {
          this.productos = productos;
          if (!this.productosDisponibles.some((producto) => producto.id === this.productoSeleccionadoId)) {
            this.productoSeleccionadoId = null;
          }
          this.cargando = false;
        },
        error: () => {
          this.productos = [];
          this.cargando = false;
          this.error = 'No pudimos cargar el catálogo. Comprueba que JSON Server esté activo e inténtalo de nuevo.';
        },
      });
  }

  trackById(_index: number, producto: Producto): number {
    return producto.id;
  }

  enviarSolicitud(formulario: NgForm): void {
    this.errorFormulario = '';
    this.confirmacionSolicitud = '';

    if (this.cargando) {
      this.errorFormulario = 'Espera a que termine la carga del catálogo para seleccionar un producto.';
      return;
    }

    if (this.error || this.productosDisponibles.length === 0) {
      this.errorFormulario = 'No se puede simular la solicitud porque el catálogo no está disponible.';
      return;
    }

    if (formulario.invalid) {
      formulario.control.markAllAsTouched();
      return;
    }

    const producto = this.productoSeleccionado;
    if (!producto) {
      this.errorFormulario = 'Selecciona un producto disponible.';
      return;
    }

    if (!this.esCantidadEntera) {
      this.errorFormulario = 'La cantidad debe ser un número entero.';
      return;
    }

    if (this.cantidad > producto.stock) {
      this.errorFormulario = `Solo hay ${producto.stock} unidades disponibles de ${producto.nombre}.`;
      return;
    }

    this.confirmacionSolicitud = `Solicitud simulada localmente: ${this.cantidad} × ${producto.nombre}. No se registró una compra ni se guardó un pedido.`;
  }
}
