import { Injectable, signal } from '@angular/core';
import { AuthUser } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly storageKey = 'dulce-esencia-demo-user';

  readonly currentUser = signal<AuthUser | null>(this.readUserFromStorage());
  readonly isAuthenticated = signal(this.currentUser() !== null);

  login(email: string, password: string): boolean {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();
    const validEmail = 'cliente@dulceesencia.com';
    const validPassword = 'Dulce123!';

    if (normalizedEmail !== validEmail || normalizedPassword !== validPassword) {
      return false;
    }

    const user: AuthUser = {
      email: normalizedEmail,
      name: 'Cliente Dulce Esencia',
      role: 'cliente',
    };

    localStorage.setItem(this.storageKey, JSON.stringify(user));
    this.currentUser.set(user);
    this.isAuthenticated.set(true);
    return true;
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
      const parsedUser = JSON.parse(storedUser) as AuthUser;
      this.isAuthenticated.set(true);
      return parsedUser;
    } catch {
      localStorage.removeItem(this.storageKey);
      this.isAuthenticated.set(false);
      return null;
    }
  }
}
