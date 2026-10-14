import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, provideRouter, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { routes } from '../../app.routes';
import { AuthService } from './auth.service';
import { authGuard } from '../guards/auth.guard';

describe('administrative and client access', () => {
  const storageKey = 'dulce-esencia-demo-user';

  beforeEach(() => {
    localStorage.removeItem(storageKey);
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  afterEach(() => localStorage.removeItem(storageKey));

  it('authenticates the administrator and persists the admin role', () => {
    const auth = TestBed.inject(AuthService);

    expect(auth.loginAdmin('admin@dulceesencia.com', 'AdminDulce123!')).toBe(true);
    expect(auth.currentUser()?.role).toBe('admin');
    expect(JSON.parse(localStorage.getItem(storageKey) ?? '{}').role).toBe('admin');
  });

  it('keeps the client account separate from the admin login', () => {
    const auth = TestBed.inject(AuthService);

    expect(auth.loginAdmin('cliente@dulceesencia.com', 'Dulce123!')).toBe(false);
    expect(auth.loginCliente('cliente@dulceesencia.com', 'Dulce123!')).toBe(true);
    expect(auth.currentUser()?.role).toBe('cliente');
  });

  it('allows only admins through the dashboard guard', () => {
    const auth = TestBed.inject(AuthService);
    const router = TestBed.inject(Router);
    const route = {} as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;

    const guestResult = TestBed.runInInjectionContext(() => authGuard(route, state));
    expect(guestResult instanceof UrlTree).toBe(true);
    expect(router.serializeUrl(guestResult as UrlTree)).toBe('/');

    auth.loginCliente('cliente@dulceesencia.com', 'Dulce123!');
    const clientResult = TestBed.runInInjectionContext(() => authGuard(route, state));
    expect(clientResult instanceof UrlTree).toBe(true);
    expect(router.serializeUrl(clientResult as UrlTree)).toBe('/');

    auth.loginAdmin('admin@dulceesencia.com', 'AdminDulce123!');
    expect(TestBed.runInInjectionContext(() => authGuard(route, state))).toBe(true);
  });

  it('leaves public shopping and account routes unguarded', () => {
    const publicPaths = ['', 'productos', 'ofertas', 'tienda', 'carrito', 'checkout', 'contacto', 'mi-cuenta', 'login'];

    for (const path of publicPaths) {
      expect(routes.find((route) => route.path === path)?.canActivate ?? []).toEqual([]);
    }
  });
});
