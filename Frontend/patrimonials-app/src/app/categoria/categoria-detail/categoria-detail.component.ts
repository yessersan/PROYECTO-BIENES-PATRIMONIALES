import { Component, OnInit } from '@angular/core';
import { Categoria } from '../../models/categoria.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-categoria-detail',
  standalone: false,
  templateUrl: './categoria-detail.component.html',
  styleUrl: './categoria-detail.component.css',
  providers: [MessageService]
})
export class CategoriaDetailComponent implements OnInit {
  categoria: Partial<Categoria> = {};
  id: string | null = null;
  esNuevo = false;
  error = '';
  usuario: any = null;
  menuItems = [
    { label: 'Dashboard', icon: 'pi pi-chart-bar', routerLink: '/dashboard' },
    { label: 'Bienes', icon: 'pi pi-box', routerLink: '/bienes' },
    { label: 'Categorías', icon: 'pi pi-list', routerLink: '/categorias' },
    { label: 'Responsables', icon: 'pi pi-users', routerLink: '/responsables' },
    { label: 'Movimientos', icon: 'pi pi-exchange', routerLink: '/movimientos' },
    { label: 'Reportes', icon: 'pi pi-chart-line', routerLink: '/reportes' },
    { label: 'Historial de Auditoría', icon: 'pi pi-history', routerLink: '/historial-auditoria' },
    { label: 'Documentos', icon: 'pi pi-file', routerLink: '/documentos' },
    {label: 'Ubicaciones', icon: 'pi pi-map-marker',routerLink: '/ubicaciones'},
    {label: 'Mantenimientos', icon: 'pi pi-cog', routerLink: '/mantenimientos'},
  ];

  constructor(
    private route: ActivatedRoute,
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
    this.id = this.route.snapshot.paramMap.get('id');
    this.esNuevo = this.id === 'nuevo';
    if (!this.esNuevo && this.id) {
      this.api.getCategoria(Number(this.id)).subscribe({
        next: (cat) => this.categoria = cat,
        error: () => {
          this.error = 'No se pudo cargar la categoría';
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo cargar la categoría',
            life: 3000
          });
        }
      });
    }
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

  guardar() {
    if (this.esNuevo) {
      this.api.createCategoria(this.categoria).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Categoría creada correctamente',
            life: 3000
          });
          this.router.navigate(['/categorias']);
        },
        error: () => {
          this.error = 'No se pudo crear la categoría';
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo crear la categoría',
            life: 3000
          });
        }
      });
    } else if (this.id) {
      this.api.updateCategoria(Number(this.id), this.categoria).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Categoría actualizada correctamente',
            life: 3000
          });
          this.router.navigate(['/categorias']);
        },
        error: () => {
          this.error = 'No se pudo actualizar la categoría';
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar la categoría',
            life: 3000
          });
        }
      });
    }
  }

  cancelar() {
    this.router.navigate(['/categorias']);
  }

  volver() {
    this.router.navigate(['/categorias']);
  }
}