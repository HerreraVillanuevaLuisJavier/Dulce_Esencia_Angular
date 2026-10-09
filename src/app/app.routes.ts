import { Routes } from '@angular/router';
import { ContactoPage } from './pages/contacto/contacto';
import { DashboardPage } from './pages/dashboard/dashboard';
import { HomePage } from './pages/home/home';
import { LoginPage } from './pages/login/login';
import { MiCuentaPage } from './pages/mi-cuenta/mi-cuenta';
import { NotFoundPage } from './pages/not-found/not-found';
import { OfertasPage } from './pages/ofertas/ofertas';
import { ProductosPage } from './pages/productos/productos';
import { TiendaPage } from './pages/tienda/tienda';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'productos', component: ProductosPage },
  { path: 'ofertas', component: OfertasPage },
  { path: 'tienda', component: TiendaPage },
  { path: 'contacto', component: ContactoPage },
  { path: 'mi-cuenta', component: MiCuentaPage },
  { path: 'login', component: LoginPage },
  { path: 'dashboard', component: DashboardPage, canActivate: [authGuard] },
  { path: '404', component: NotFoundPage },
  { path: '**', redirectTo: '404' },
];
