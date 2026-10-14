export type TipoEntrega = 'delivery' | 'recojo';

export interface LineaPedido {
  productoId: number;
  nombre: string;
  precioUnitario: number;
  cantidad: number;
  subtotal: number;
}

export interface PedidoNuevo {
  fechaCreacion: string;
  nombreCliente: string;
  correoCliente: string;
  tipoEntrega: TipoEntrega;
  direccion?: string;
  referencias?: string;
  productos: LineaPedido[];
  total: number;
  estado: 'pendiente';
}

export interface Pedido extends PedidoNuevo { id: number | string }
