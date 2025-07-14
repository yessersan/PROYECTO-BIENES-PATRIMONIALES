import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Usuario } from '../models/usuario.model';
import { Registro } from '../models/registro';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
getUsuarioBackend(): Observable<Usuario> {
  return this.apiService.get<Usuario>('auth/usuario/');
}
  
  constructor(private apiService: ApiService) {}

  registrar(registroData: Registro): Observable<any> {
    return this.apiService.registrar(registroData);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

    login(credentials: { username: string; password: string }): Observable<{ token: string; usuario: Usuario }> {
    return this.apiService.post('login/', credentials);
  }

setSession(token: string, usuario: Usuario | null): void {
  localStorage.setItem('token', token);
  localStorage.setItem('usuario', JSON.stringify(usuario));
}

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }

  getUsuario(): Usuario | null {
    const usuarioStr = localStorage.getItem('usuario');
    if (!usuarioStr) return null;
    try {
      return JSON.parse(usuarioStr);
    } catch {
      this.logout();
      return null;
    }
  }
  
}