import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Pedido } from '../../core/models/pedido.model';
import { CarritoService } from '../../core/services/carrito.service';
import { PedidoService } from '../../core/services/pedido.service';
import { ProductoService } from '../../core/services/producto.service';

@Component({ selector: 'app-checkout-page', standalone: true, imports: [CommonModule, FormsModule, RouterLink], templateUrl: './checkout.html', styleUrl: './checkout.css' })
export class CheckoutPage implements OnInit {
  readonly carrito = inject(CarritoService);
  private readonly productos = inject(ProductoService);
  private readonly pedidos = inject(PedidoService);
  private readonly destroyRef = inject(DestroyRef);
  nombre = ''; correo = ''; tipoEntrega: 'delivery' | 'recojo' = 'recojo'; direccion = ''; referencias = '';
  cargandoCatalogo = true; enviando = false; error = ''; confirmacion: Pedido | null = null;

  ngOnInit(): void {
    this.productos.obtenerProductosActuales().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (catalogo) => { this.carrito.sincronizarCatalogo(catalogo); this.cargandoCatalogo = false; },
      error: () => { this.error = 'No se pudo verificar el catálogo. Intenta recargar esta página.'; this.cargandoCatalogo = false; },
    });
  }

  confirmar(formulario: NgForm): void {
    if (this.enviando) return;
    this.error = '';
    if (this.carrito.avisoStock()) { this.error = 'El stock del catálogo cambió. Vuelve al carrito, revisa las cantidades y continúa nuevamente.'; return; }
    if (!this.carrito.lineas().length) { this.error = 'El carrito está vacío. Añade productos antes de confirmar.'; return; }
    if (formulario.invalid) { formulario.control.markAllAsTouched(); return; }
    if (!this.nombre.trim()) { this.error = 'Ingresa tu nombre completo.'; return; }
    if (this.tipoEntrega === 'delivery' && !this.direccion.trim()) { this.error = 'Ingresa la dirección de entrega.'; return; }
    this.cargandoCatalogo = true;
    this.productos.obtenerProductosActuales().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (catalogo) => {
        const problemas = this.carrito.validarStock(catalogo);
        if (problemas.length) { this.carrito.sincronizarCatalogo(catalogo); this.error = `${problemas.join(' ')} Revisa y corrige el carrito antes de confirmar.`; this.cargandoCatalogo = false; return; }
        this.carrito.sincronizarCatalogo(catalogo);
        const lineas = this.carrito.lineas().map((linea) => {
          const producto = catalogo.find((item) => item.id === linea.producto.id)!;
          const subtotal = Math.round((producto.precio * linea.cantidad + Number.EPSILON) * 100) / 100;
          return { productoId: producto.id, nombre: producto.nombre, precioUnitario: producto.precio, cantidad: linea.cantidad, subtotal };
        });
        const nuevoPedido = {
          fechaCreacion: new Date().toISOString(), nombreCliente: this.nombre.trim(), correoCliente: this.correo.trim(), tipoEntrega: this.tipoEntrega,
          ...(this.tipoEntrega === 'delivery' ? { direccion: this.direccion.trim(), ...(this.referencias.trim() ? { referencias: this.referencias.trim() } : {}) } : {}),
          productos: lineas, total: Math.round((lineas.reduce((sum, linea) => sum + linea.subtotal, 0) + Number.EPSILON) * 100) / 100, estado: 'pendiente' as const,
        };
        this.enviando = true;
        this.pedidos.crear(nuevoPedido).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
          next: (pedido) => { this.confirmacion = pedido; this.carrito.vaciar(); this.enviando = false; this.cargandoCatalogo = false; },
          error: () => { this.error = 'No se pudo registrar el pedido. Tu carrito se conservó; puedes intentarlo de nuevo.'; this.enviando = false; this.cargandoCatalogo = false; },
        });
      },
      error: () => { this.error = 'No se pudo comprobar el stock. El pedido no se registró y el carrito se conservó.'; this.cargandoCatalogo = false; },
    });
  }
}
