export type CategoriaProducto = 'Tortas' | 'Cupcakes' | 'Cheesecakes' | 'Cajas de postres';

export type OfertaProducto =
  | { tipo: 'porcentaje'; porcentaje: number }
  | { tipo: '2x1' };

export interface Producto {
  id: number;
  nombre: string;
  imagen: string;
  categoria: CategoriaProducto;
  precio: number;
  stock: number;
  oferta?: OfertaProducto;
}
