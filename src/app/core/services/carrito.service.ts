import { computed, Injectable, signal } from '@angular/core';
import { Producto } from '../models/producto.model';

export interface LineaCarrito {
  producto: Producto;
  cantidad: number;
  subtotal: number;
}

interface LineaGuardada { productoId: number; cantidad: number }

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private readonly storageKey = 'dulce-esencia-carrito';
  private readonly cantidades = signal<LineaGuardada[]>(this.leerStorage());
  readonly lineas = signal<LineaCarrito[]>([]);
  readonly avisoStock = signal('');
  readonly unidades = computed(() => this.cantidades().reduce((sum, line) => sum + line.cantidad, 0));
  readonly total = computed(() => this.lineas().reduce((sum, line) => sum + line.subtotal, 0));

  cantidadDe(productoId: number): number {
    return this.cantidades().find((line) => line.productoId === productoId)?.cantidad ?? 0;
  }

  sincronizarCatalogo(productos: Producto[]): void {
    let ajustado = false;
    const vigentes = this.cantidades().flatMap((line) => {
      const producto = productos.find((item) => item.id === line.productoId);
      if (!producto || producto.stock <= 0) { ajustado = true; return []; }
      const cantidad = Math.min(line.cantidad, producto.stock);
      if (cantidad !== line.cantidad) ajustado = true;
      return [{ productoId: producto.id, cantidad }];
    });
    this.cantidades.set(vigentes);
    this.lineas.set(vigentes.flatMap((line) => {
      const producto = productos.find((item) => item.id === line.productoId);
      return producto ? [{ producto, cantidad: line.cantidad, subtotal: this.redondear(producto.precio * line.cantidad) }] : [];
    }));
    this.avisoStock.set(ajustado ? 'El catálogo cambió; se actualizaron las cantidades al stock disponible.' : '');
    this.persistir();
  }

  agregar(producto: Producto): boolean {
    const cantidad = this.cantidadDe(producto.id);
    if (producto.stock <= cantidad) return false;
    this.actualizarCantidad(producto, cantidad + 1);
    return true;
  }

  establecerCantidad(producto: Producto, cantidad: number): boolean {
    if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > producto.stock) return false;
    this.actualizarCantidad(producto, cantidad);
    return true;
  }

  eliminar(productoId: number): void {
    this.cantidades.set(this.cantidades().filter((line) => line.productoId !== productoId));
    this.lineas.set(this.lineas().filter((line) => line.producto.id !== productoId));
    this.persistir();
  }

  vaciar(): void {
    this.cantidades.set([]); this.lineas.set([]); this.avisoStock.set(''); this.persistir();
  }

  validarStock(productos: Producto[]): string[] {
    return this.cantidades().flatMap((line) => {
      const producto = productos.find((item) => item.id === line.productoId);
      return !producto ? [`El producto ${line.productoId} ya no está disponible.`] :
        line.cantidad > producto.stock ? [`${producto.nombre}: quedan ${producto.stock} unidades y seleccionaste ${line.cantidad}.`] : [];
    });
  }

  private actualizarCantidad(producto: Producto, cantidad: number): void {
    this.cantidades.set([...this.cantidades().filter((line) => line.productoId !== producto.id), { productoId: producto.id, cantidad }]);
    this.lineas.set([...this.lineas().filter((line) => line.producto.id !== producto.id), { producto, cantidad, subtotal: this.redondear(producto.precio * cantidad) }]);
    this.avisoStock.set(''); this.persistir();
  }

  private leerStorage(): LineaGuardada[] {
    try {
      const raw = globalThis.localStorage?.getItem(this.storageKey);
      if (!raw) return [];
      const value: unknown = JSON.parse(raw);
      if (!Array.isArray(value)) throw new Error('Formato inválido');
      return value.filter((line): line is LineaGuardada => !!line && Number.isInteger(line.productoId) && line.productoId > 0 && Number.isInteger(line.cantidad) && line.cantidad > 0);
    } catch {
      try { globalThis.localStorage?.removeItem(this.storageKey); } catch { /* storage unavailable */ }
      return [];
    }
  }

  private persistir(): void {
    try { globalThis.localStorage?.setItem(this.storageKey, JSON.stringify(this.cantidades())); } catch { /* storage unavailable */ }
  }

  private redondear(valor: number): number { return Math.round((valor + Number.EPSILON) * 100) / 100; }
}
