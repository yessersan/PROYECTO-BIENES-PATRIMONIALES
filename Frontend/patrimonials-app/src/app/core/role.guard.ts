// src/app/core/role.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // Verificar primero si hay usuario autenticado
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }
  
    const requiredRoles = next.data['roles'] as Array<string>;
    const usuario = this.authService.getUsuario();
    
    // Si la ruta no requiere roles específicos, permitir acceso
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }
  
    // Verificar roles (insensible a mayúsculas)
    const tieneAcceso = requiredRoles.some(rol => 
      usuario?.rol?.toUpperCase() === rol.toUpperCase()
    );
  
    if (!tieneAcceso) {
      console.warn(`Acceso denegado. Rol requerido: ${requiredRoles}, Rol actual: ${usuario?.rol}`);
      this.router.navigate(['/dashboard']); // O a una página de acceso denegado
      return false;
    }
    
    return true;
  }
}