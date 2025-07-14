import { Component, OnInit } from '@angular/core';
import { Categoria } from '../../models/categoria.model';
import { ApiService } from '../../core/api.service';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-categoria-list',
  standalone: false,
  templateUrl: './categoria-list.component.html',
  styleUrls: ['./categoria-list.component.css'],
  providers: [MessageService]
})
export class CategoriaListComponent implements OnInit {
  categorias: Categoria[] = [];
  loading = false;
  error = '';
  usuario: any = null;
  rol: string = '';
  menuItems: any[] = [];

  constructor(
    private api: ApiService,
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.getUsuario();
    if (!this.usuario) {
      this.mostrarMensaje('error', 'Acceso Denegado', 'No se encontró información de usuario');
      this.router.navigate(['/login']);
      return;
    }

    this.rol = this.usuario.rol?.toUpperCase();
    if (!['ADMIN', 'GESTOR'].includes(this.rol)) {
      this.mostrarMensaje('error', 'Sin permiso', 'No tienes acceso a esta sección');
      this.router.navigate(['/dashboard']);
      return;
    }

    this.menuItems = this.filtrarMenuPorRol();
    this.getCategorias();
  }

  filtrarMenuPorRol(): any[] {
    const menu = [
      { label: 'Dashboard', icon: 'pi pi-chart-bar', routerLink: '/dashboard', roles: ['ADMIN', 'GESTOR'] },
      { label: 'Bienes', icon: 'pi pi-box', routerLink: '/bienes', roles: ['ADMIN', 'GESTOR'] },
      { label: 'Categorías', icon: 'pi pi-list', routerLink: '/categorias', roles: ['ADMIN', 'GESTOR'] },
      { label: 'Responsables', icon: 'pi pi-users', routerLink: '/responsables', roles: ['ADMIN', 'GESTOR'] },
      { label: 'Movimientos', icon: 'pi pi-exchange', routerLink: '/movimientos', roles: ['ADMIN', 'GESTOR'] },
      { label: 'Reportes', icon: 'pi pi-chart-line', routerLink: '/reportes', roles: ['ADMIN', 'GESTOR'] },
      { label: 'Historial de Auditoría', icon: 'pi pi-history', routerLink: '/historial-auditoria', roles: ['ADMIN', 'GESTOR'] },
      { label: 'Documentos', icon: 'pi pi-file', routerLink: '/documentos', roles: ['ADMIN', 'GESTOR'] },
      { label: 'Notificaciones', icon: 'pi pi-bell', routerLink: '/notificaciones', roles: ['ADMIN', 'GESTOR'] },
      { label: 'Etiquetas Digitales', icon: 'pi pi-qrcode', routerLink: '/etiquetas-digitales', roles: ['ADMIN', 'GESTOR'] },
      { label: 'Ubicaciones', icon: 'pi pi-map-marker', routerLink: '/ubicaciones', roles: ['ADMIN', 'GESTOR'] },
      { label: 'Mantenimientos', icon: 'pi pi-cog', routerLink: '/mantenimientos', roles: ['ADMIN', 'GESTOR'] }
    ];

    return menu.filter(item => item.roles.includes(this.rol));
  }

  getCategorias() {
    this.loading = true;
    this.api.getCategorias().subscribe({
      next: (data: Categoria[]) => {
        this.categorias = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar categorías';
        this.mostrarMensaje('error', 'Error', 'No se pudieron cargar las categorías');
        this.loading = false;
      }
    });
  }

  eliminarCategoria(id: number) {
    if (confirm('¿Eliminar esta categoría?')) {
      this.api.deleteCategoria(id).subscribe({
        next: () => {
          this.mostrarMensaje('success', 'Éxito', 'Categoría eliminada correctamente');
          this.getCategorias();
        },
        error: () => {
          this.mostrarMensaje('error', 'Error', 'No se pudo eliminar la categoría');
        }
      });
    }
  }

  crearCategoria() {
    this.router.navigate(['/categorias', 'nuevo']);
  }

  verDetalle(id: number) {
    this.router.navigate(['/categorias', id]);
  }

  volver() {
    this.router.navigate(['/dashboard']);
  }

  cerrarSesion() {
    this.authService.logout();
    this.mostrarMensaje('success', 'Sesión cerrada', 'Has cerrado sesión exitosamente');
    this.router.navigate(['/login']);
  }

  navigateToRoute(route: string) {
    this.router.navigate([route]);
  }

  mostrarMensaje(severidad: string, resumen: string, detalle: string) {
    this.messageService.add({
      severity: severidad,
      summary: resumen,
      detail: detalle,
      life: 3000
    });
  }
}
