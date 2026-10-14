import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pedido, PedidoNuevo } from '../models/pedido.model';
import { API_URL } from './api.config';

@Injectable({ providedIn: 'root' })
export class PedidoService {
  private readonly http = inject(HttpClient);
  crear(pedido: PedidoNuevo): Observable<Pedido> {
    return this.http.post<Pedido>(`${API_URL}/pedidos`, pedido);
  }
}
