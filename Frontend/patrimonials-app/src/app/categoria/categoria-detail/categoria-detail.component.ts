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
  styleUrls: ['./categoria-detail.component.css'],
  providers: [MessageService]
})
export class CategoriaDetailComponent implements OnInit {
  categoria: Partial<Categoria> = {
    nombre: '',
    descripcion: '',
    vida_util: 0,
    tasa_depreciacion: 0,
    activa: false
  };

  id: string | null = null;
  esNuevo = false;
  error = '';
  usuario: any = null;
  rol: string = '';
  menuItems: any[] = [];

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

    this.id = this.route.snapshot.paramMap.get('id');
    this.esNuevo = this.id === 'nuevo';

    if (!this.esNuevo && this.id) {
      this.api.getCategoria(Number(this.id)).subscribe({
        next: (cat) => this.categoria = cat,
        error: () => this.mostrarMensaje('error', 'Error', 'No se pudo cargar la categoría')
      });
    }
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

guardar() {
  // Validación básica antes de enviar
  if (!this.categoria.nombre || !this.categoria.nombre.trim()) {
    this.mostrarMensaje('error', 'Error', 'El nombre es obligatorio');
    return;
  }
  if (this.categoria.vida_util == null || isNaN(Number(this.categoria.vida_util)) || this.categoria.vida_util < 0) {
    this.mostrarMensaje('error', 'Error', 'La vida útil debe ser mayor o igual a 0');
    return;
  }
  if (
    this.categoria.tasa_depreciacion == null ||
    isNaN(Number(this.categoria.tasa_depreciacion)) ||
    this.categoria.tasa_depreciacion < 0 ||
    this.categoria.tasa_depreciacion > 100
  ) {
    this.mostrarMensaje('error', 'Error', 'La tasa de depreciación debe estar entre 0 y 100');
    return;
  }

  const payload: Partial<Categoria> = {
    nombre: (this.categoria.nombre ?? '').trim(),
    descripcion: this.categoria.descripcion || '',
    vida_util: Number(this.categoria.vida_util),
    tasa_depreciacion: Number(this.categoria.tasa_depreciacion),
    activa: !!this.categoria.activa
  };

  if (this.esNuevo) {
    this.api.createCategoria(payload).subscribe({
      next: () => {
        this.mostrarMensaje('success', 'Éxito', 'Categoría creada correctamente');
        this.router.navigate(['/categorias']);
      },
      error: (error) => {
        let errorMessage = 'No se pudo crear la categoría';
        if (error.error && typeof error.error === 'object') {
          errorMessage = Object.values(error.error).flat().join(' ');
        } else if (error.error && typeof error.error === 'string') {
          errorMessage = error.error;
        }
        this.mostrarMensaje('error', 'Error', errorMessage);
      }
    });
  } else if (this.id) {
    this.api.updateCategoria(Number(this.id), payload).subscribe({
      next: () => {
        this.mostrarMensaje('success', 'Éxito', 'Categoría actualizada correctamente');
        this.router.navigate(['/categorias']);
      },
      error: (error) => {
        let errorMessage = 'No se pudo actualizar la categoría';
        if (error.error && typeof error.error === 'object') {
          errorMessage = Object.values(error.error).flat().join(' ');
        } else if (error.error && typeof error.error === 'string') {
          errorMessage = error.error;
        }
        this.mostrarMensaje('error', 'Error', errorMessage);
      }
    });
  }
}
  eliminar() {
    if (this.id && confirm('¿Eliminar esta categoría?')) {
      this.api.deleteCategoria(Number(this.id)).subscribe({
        next: () => {
          this.mostrarMensaje('success', 'Éxito', 'Categoría eliminada correctamente');
          this.router.navigate(['/categorias']);
        },
        error: (err) => {
          let msg = 'No se pudo eliminar la categoría';
          if (err.error && err.error.error) {
            msg = err.error.error;
          }
          this.mostrarMensaje('error', 'Error', msg);
        }
      });
    }
  }
  // ...existing code...

  cancelar() {
    this.router.navigate(['/categorias']);
  }

  volver() {
    this.router.navigate(['/categorias']);
  }

  cerrarSesion() {
    this.authService.logout();
    this.mostrarMensaje('success', 'Sesión cerrada', 'Has cerrado sesión exitosamente');
    this.router.navigate(['/login']);
  }

  mostrarMensaje(severidad: string, resumen: string, detalle: string) {
    this.messageService.add({
      severity: severidad,
      summary: resumen,
      detail: detalle,
      life: 5000
    });
  }

  navigateToRoute(route: string) {
    this.router.navigate([route]);
  }
}