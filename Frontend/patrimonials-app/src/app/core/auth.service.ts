import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Usuario } from '../models/usuario.model';
import { Registro } from '../models/registro';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private apiService: ApiService) {}

  // Métodos existentes
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    // Aquí podrías añadir validación JWT más avanzada si es necesario
    return true;
  }

  isLoggedIn(): boolean {
    return this.isTokenValid();
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario'); // Opcional: limpiar datos de usuario
  }

  // Métodos para login (si no existen)
  login(credentials: { username: string; password: string }): Observable<{ token: string, usuario: Usuario }> {
    return this.apiService.post('/auth/login', credentials);
  }

  setSession(token: string, usuario: Usuario): void {
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario)); // Opcional: guardar datos de usuario
  }

  getUsuario(): Usuario | null {
    try {
      const usuario = localStorage.getItem('usuario');
      return usuario ? JSON.parse(usuario) : null;
    } catch (e) {
      console.error('Error al parsear usuario', e);
      this.logout();
      return null;
    }
  }

  // Métodos para registro (nuevos)
registrar(registroData: Registro): Observable<{ token: string, usuario: Usuario }> {
  const { confirmPassword, ...userData } = registroData;
  return this.apiService.post('/auth/registro', userData);
}

  verificarUsernameUnico(username: string): Observable<boolean> {
    return this.apiService.get(`/auth/verificar-username?username=${username}`);
  }

  verificarEmailUnico(email: string): Observable<boolean> {
    return this.apiService.get(`/auth/verificar-email?email=${email}`);
  }

  // Método para verificar roles (útil para guards)
  tieneRol(rol: string): boolean {
    const usuario = this.getUsuario();
    return usuario ? usuario.rol === rol : false;
  }

  // Método para verificar si es admin
  esAdmin(): boolean {
    return this.tieneRol('ADMIN');
  }
}