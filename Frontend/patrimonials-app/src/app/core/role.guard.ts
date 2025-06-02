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
    const requiredRoles = next.data['roles'] as Array<string>;
    const usuario = this.authService.getUsuario();
    
    if (!usuario || !requiredRoles.includes(usuario.rol)) {
      this.router.navigate(['/dashboard']); // O a una página de acceso denegado
      return false;
    }
    
    return true;
  }
}