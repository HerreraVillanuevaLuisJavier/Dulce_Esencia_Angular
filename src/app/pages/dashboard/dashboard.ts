import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Producto } from '../../core/models/producto.model';
import { ProductoService } from '../../core/services/producto.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardPage implements OnInit {
  readonly authService = inject(AuthService);
  readonly router = inject(Router);
  private readonly productoService = inject(ProductoService);
  private readonly destroyRef = inject(DestroyRef);

  productos: Producto[] = [];
  cargandoProductos = true;
  errorProductos = '';

  get totalProductos(): number {
    return this.productos.length;
  }

  get productosSinStock(): number {
    return this.productos.filter((producto) => producto.stock === 0).length;
  }

  get productosStockBajo(): number {
    return this.productos.filter((producto) => producto.stock > 0 && producto.stock <= 5).length;
  }

  get inventarioCritico(): number {
    return this.productosSinStock + this.productosStockBajo;
  }

  get ofertasActivas(): number {
    return this.productos.filter((producto) => {
      const unidadesNecesarias = producto.oferta?.tipo === '2x1' ? 2 : 1;
      return producto.oferta && producto.stock >= unidadesNecesarias;
    }).length;
  }

  ngOnInit(): void {
    this.cargarProductos();
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
          this.cargandoProductos = false;
        },
        error: () => {
          this.productos = [];
          this.cargandoProductos = false;
          this.errorProductos = 'No se pudieron cargar las estadísticas del catálogo. El acceso y la sesión siguen activos.';
        },
      });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }
}
