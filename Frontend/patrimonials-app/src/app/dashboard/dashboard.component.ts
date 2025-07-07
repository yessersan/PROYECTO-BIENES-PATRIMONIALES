import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth.service';
<<<<<<< HEAD
=======
import { MenuItem } from 'primeng/api';
import { MessageService } from 'primeng/api';
>>>>>>> origin/yezer

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
<<<<<<< HEAD
  styleUrls: ['./dashboard.component.css']
=======
  styleUrls: ['./dashboard.component.css'],
  providers: [MessageService]
>>>>>>> origin/yezer
})
export class DashboardComponent implements OnInit {
  mobileMenuOpen = false;
  usuario: any = null;
  rolesPermitidos: string[] = [];
  accesoDenegado: boolean = false;
<<<<<<< HEAD

  constructor(private authService: AuthService, private router: Router) {}
=======
  
  menuItems: MenuItem[] = [];
  panelMenuItems: MenuItem[] = [];

  constructor(
    private authService: AuthService, 
    public router: Router,
    private messageService: MessageService
  ) {}
>>>>>>> origin/yezer

  ngOnInit() {
    this.usuario = this.authService.getUsuario();
    console.log('Usuario actual:', this.usuario);
<<<<<<< HEAD
    
=======

>>>>>>> origin/yezer
    if (!this.usuario) {
      this.accesoDenegado = true;
      console.error('No se encontró información de usuario');
    }
<<<<<<< HEAD
=======

    this.menuItems = [
      {
        label: 'Bienes',
        icon: 'pi pi-box',
        routerLink: '/bienes',
        visible: this.puedeAcceder(['ADMIN', 'GESTOR'])
      },
      {
        label: 'Responsables',
        icon: 'pi pi-users',
        routerLink: '/responsables',
        visible: this.puedeAcceder(['ADMIN', 'GESTOR'])
      },
      {
        label: 'Categorías',
        icon: 'pi pi-tags',
        routerLink: '/categorias',
        visible: this.puedeAcceder(['ADMIN', 'GESTOR'])
      },
      {
        label: 'Ubicaciones',
        icon: 'pi pi-map-marker',
        routerLink: '/ubicaciones',
        visible: this.puedeAcceder(['ADMIN', 'GESTOR'])
      },
      {
        label: 'Movimientos',
        icon: 'pi pi-exchange',
        routerLink: '/movimientos',
        visible: this.puedeAcceder(['ADMIN', 'GESTOR', 'AUDITOR'])
      },
      {
        label: 'Reportes',
        icon: 'pi pi-chart-bar',
        routerLink: '/reportes',
        visible: this.puedeAcceder(['ADMIN', 'GESTOR', 'AUDITOR', 'CONSULTA'])
      },
      {
        label: 'Historial de Auditoría',
        icon: 'pi pi-history',
        routerLink: '/historial-auditoria',
        visible: this.puedeAcceder(['ADMIN', 'AUDITOR'])
      },
      {
        label: 'Documentos',
        icon: 'pi pi-file',
        routerLink: '/documentos',
        visible: this.puedeAcceder(['ADMIN', 'GESTOR'])
      },
      {
        label: 'Notificaciones',
        icon: 'pi pi-bell',
        routerLink: '/notificaciones',
        badge: '3'
      },
      {
        label: 'Mantenimientos',
        icon: 'pi pi-cog',
        routerLink: '/mantenimientos',
        visible: this.puedeAcceder(['ADMIN', 'GESTOR'])
      },
      {
        label: 'Etiquetas Digitales',
        icon: 'pi pi-qrcode',
        routerLink: '/etiquetas-digitales',
        visible: this.puedeAcceder(['ADMIN', 'GESTOR'])
      }
    ];

    this.panelMenuItems = [
      {
        label: 'Menú Principal',
        items: this.menuItems.filter(item => item.visible !== false)
      }
    ];
>>>>>>> origin/yezer
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }

<<<<<<< HEAD
  cerrarSesion() {
    this.authService.logout(); 
=======
  // Método para navegar a una ruta
  navigateToRoute(route: string | undefined) {
    if (route) {
      this.router.navigate([route]);
      this.closeMobileMenu();
    }
  }

  // Método para obtener la severidad del rol
  getRoleSeverity(rol: string): "success" | "info" | "warning" | "danger" | "secondary" | "contrast" | undefined {
    switch(rol?.toUpperCase()) {
      case 'ADMIN':
        return 'danger';
      case 'GESTOR':
        return 'warning';
      case 'AUDITOR':
        return 'info';
      case 'CONSULTA':
        return 'success';
      default:
        return 'secondary';
    }
  }

  cerrarSesion() {
    this.authService.logout();
    this.messageService.add({
      severity: 'success',
      summary: 'Sesión cerrada',
      detail: 'Has cerrado sesión exitosamente'
    });
>>>>>>> origin/yezer
    this.router.navigate(['/login']);
  }

  // Método para verificar si una ruta es accesible
  puedeAcceder(rolesRequeridos: string[]): boolean {
    if (!this.usuario || !this.usuario.rol) return false;
    return rolesRequeridos.some(r => r.toUpperCase() === this.usuario.rol.toUpperCase());
  }
}