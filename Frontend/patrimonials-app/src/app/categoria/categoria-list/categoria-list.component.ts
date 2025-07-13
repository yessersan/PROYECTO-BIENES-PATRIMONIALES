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
  styleUrl: './categoria-list.component.css',
  providers: [MessageService]
})
export class CategoriaListComponent implements OnInit {
  categorias: Categoria[] = [];
  loading = false;
  error = '';
  usuario: any = null;
  menuItems = [
    { label: 'Dashboard', icon: 'pi pi-chart-bar', routerLink: '/dashboard' },
    { label: 'Bienes', icon: 'pi pi-box', routerLink: '/bienes' },
    { label: 'Categorías', icon: 'pi pi-list', routerLink: '/categorias' },
    { label: 'Responsables', icon: 'pi pi-users', routerLink: '/responsables' },
    { label: 'Movimientos', icon: 'pi pi-exchange', routerLink: '/movimientos' },
    { label: 'Reportes', icon: 'pi pi-chart-line', routerLink: '/reportes' },
    { label: 'Historial de Auditoría', icon: 'pi pi-history', routerLink: '/auditoria' },
    { label: 'Documentos', icon: 'pi pi-file', routerLink: '/documentos' },
    { label: 'Notificaciones', icon: 'pi pi-bell', routerLink: '/notificaciones' },
    { label: 'Etiquetas Digitales', icon: 'pi pi-qrcode', routerLink: '/etiquetas-digitales' },
  ];

  constructor(
    private api: ApiService,
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.getUsuario();
    if (!this.usuario) {
      this.messageService.add({
        severity: 'error',
        summary: 'Acceso Denegado',
        detail: 'No se encontró información de usuario',
        life: 3000
      });
      this.router.navigate(['/login']);
      return;
    }
    this.getCategorias();
  }

  getCategorias() {
    this.loading = true;
    this.api.getCategorias().subscribe({
      next: (data: Categoria[]) => { this.categorias = data; this.loading = false; },
      error: (err) => {
        this.error = 'Error al cargar categorías';
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las categorías',
          life: 3000
        });
        this.loading = false;
      }
    });
  }

  navigateToRoute(route: string) {
    this.router.navigate([route]);
  }

  cerrarSesion() {
    this.authService.logout();
    this.messageService.add({
      severity: 'success',
      summary: 'Sesión cerrada',
      detail: 'Has cerrado sesión exitosamente',
      life: 3000
    });
    this.router.navigate(['/login']);
  }

  verDetalle(id: number) {
    this.router.navigate(['/categorias', id]);
  }

  eliminarCategoria(id: number) {
    if (confirm('¿Eliminar esta categoría?')) {
      this.api.deleteCategoria(id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Categoría eliminada correctamente',
            life: 3000
          });
          this.getCategorias();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo eliminar la categoría',
            life: 3000
          });
        }
      });
    }
  }

  crearCategoria() {
    this.router.navigate(['/categorias', 'nuevo']);
  }

  volver() {
    this.router.navigate(['/dashboard']);
  }
}