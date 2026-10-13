import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, shareReplay, throwError } from 'rxjs';
import { Producto } from '../models/producto.model';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/productos';

  private readonly productos$ = this.http.get<Producto[]>(this.apiUrl).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('Error al obtener productos desde JSON Server.', error);
      return throwError(() => new Error('No se pudieron cargar los productos. Verifica que JSON Server esté activo.'));
    }),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  obtenerProductos(): Observable<Producto[]> {
    return this.productos$;
  }
}
