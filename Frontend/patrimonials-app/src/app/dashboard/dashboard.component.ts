import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  mobileMenuOpen = false;
  usuario: any = null;
  rolesPermitidos: string[] = [];
  accesoDenegado: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.usuario = this.authService.getUsuario();
    console.log('Usuario actual:', this.usuario);
    
    if (!this.usuario) {
      this.accesoDenegado = true;
      console.error('No se encontró información de usuario');
    }
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }

  cerrarSesion() {
    this.authService.logout(); 
    this.router.navigate(['/login']);
  }

  // Método para verificar si una ruta es accesible
  puedeAcceder(rolesRequeridos: string[]): boolean {
    if (!this.usuario || !this.usuario.rol) return false;
    return rolesRequeridos.some(r => r.toUpperCase() === this.usuario.rol.toUpperCase());
  }
}