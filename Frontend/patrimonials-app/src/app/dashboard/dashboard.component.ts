import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { MenuItem } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [MessageService]
})
export class DashboardComponent implements OnInit, OnDestroy {
  mobileMenuOpen = false;
  usuario: any = null;
  rolesPermitidos: string[] = [];
  accesoDenegado: boolean = false;
  currentRoute: string = '';
  
  menuItems: MenuItem[] = [];
  panelMenuItems: MenuItem[] = [];
  private routerSubscription: Subscription = new Subscription();

  constructor(
    private authService: AuthService, 
    public router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.usuario = this.authService.getUsuario();
    console.log('Usuario actual:', this.usuario);

    if (!this.usuario) {
      this.accesoDenegado = true;
      console.error('No se encontró información de usuario');
      return;
    }

    this.initializeMenu();
    this.subscribeToRouteChanges();
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private initializeMenu() {
    this.menuItems = [
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        routerLink: '/dashboard',
        visible: true
      },
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
        visible: this.puedeAcceder(['ADMIN', 'AUDITOR', 'GESTOR'])
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
        badge: '3',
        visible: true
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
  }

  private subscribeToRouteChanges() {
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.url;
        this.closeMobileMenu(); // Cerrar menú móvil al cambiar de ruta
      });
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    
    // Prevenir scroll del body cuando el menú esté abierto
    if (this.mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
    document.body.style.overflow = 'auto';
  }

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

  // Método mejorado para cerrar sesión
  cerrarSesion() {
    this.authService.logout();
    this.messageService.add({
      severity: 'success',
      summary: 'Sesión cerrada',
      detail: 'Has cerrado sesión exitosamente',
      life: 3000
    });
    
    // Limpiar cualquier estado del componente
    this.usuario = null;
    this.accesoDenegado = false;
    this.closeMobileMenu();
    
    // Navegar al login
    this.router.navigate(['/login']);
  }

  // Método para verificar si una ruta es accesible
  puedeAcceder(rolesRequeridos: string[]): boolean {
    if (!this.usuario || !this.usuario.rol) return false;
    return rolesRequeridos.some(r => r.toUpperCase() === this.usuario.rol.toUpperCase());
  }

  // Método para obtener el título de la página actual
  getCurrentPageTitle(): string {
    const currentItem = this.menuItems.find(item => item.routerLink === this.currentRoute);
    return currentItem ? currentItem.label || 'Dashboard' : 'Dashboard';
  }

  // Método para verificar si una ruta está activa
  isRouteActive(route: string): boolean {
    return this.currentRoute === route;
  }

  // Método para obtener estadísticas del dashboard (ejemplo)
  getDashboardStats() {
    // Aquí puedes implementar la lógica para obtener estadísticas reales
    return {
      totalBienes: 1234,
      totalResponsables: 56,
      totalMovimientos: 89,
      totalNotificaciones: 12
    };
  }
}