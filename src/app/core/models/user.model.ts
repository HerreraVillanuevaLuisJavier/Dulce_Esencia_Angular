export interface AuthUser {
  email: string;
  name: string;
  role: 'admin' | 'cliente';
}
