import { Injectable, signal } from '@angular/core';
import { AuthUser } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly storageKey = 'dulce-esencia-demo-user';

  // Credenciales simuladas para la presentación académica. No usar en producción.
  private readonly adminDemoCredentials = {
    email: 'admin@dulceesencia.com',
    password: 'AdminDulce123!',
  };

  // Se conserva la cuenta de cliente separada del acceso administrativo.
  private readonly clientDemoCredentials = {
    email: 'cliente@dulceesencia.com',
    password: 'Dulce123!',
  };

  readonly currentUser = signal<AuthUser | null>(this.readUserFromStorage());
  readonly isAuthenticated = signal(this.currentUser() !== null);

  loginAdmin(email: string, password: string): boolean {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    if (
      normalizedEmail !== this.adminDemoCredentials.email ||
      normalizedPassword !== this.adminDemoCredentials.password
    ) {
      return false;
    }

    this.startSession({ email: normalizedEmail, name: 'Administrador Dulce Esencia', role: 'admin' });
    return true;
  }

  loginCliente(email: string, password: string): boolean {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    if (
      normalizedEmail !== this.clientDemoCredentials.email ||
      normalizedPassword !== this.clientDemoCredentials.password
    ) {
      return false;
    }

    this.startSession({ email: normalizedEmail, name: 'Cliente Dulce Esencia', role: 'cliente' });
    return true;
  }

  private startSession(user: AuthUser): void {
    localStorage.setItem(this.storageKey, JSON.stringify(user));
    this.currentUser.set(user);
    this.isAuthenticated.set(true);
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
  }

  private readUserFromStorage(): AuthUser | null {
    const storedUser = localStorage.getItem(this.storageKey);

    if (!storedUser) {
      return null;
    }

    try {
      const parsedUser: unknown = JSON.parse(storedUser);
      if (
        typeof parsedUser === 'object' &&
        parsedUser !== null &&
        'email' in parsedUser &&
        typeof parsedUser.email === 'string' &&
        'name' in parsedUser &&
        typeof parsedUser.name === 'string' &&
        'role' in parsedUser &&
        (parsedUser.role === 'admin' || parsedUser.role === 'cliente')
      ) {
        return { email: parsedUser.email, name: parsedUser.name, role: parsedUser.role };
      }

      localStorage.removeItem(this.storageKey);
      return null;
    } catch {
      localStorage.removeItem(this.storageKey);
      return null;
    }
  }
}
