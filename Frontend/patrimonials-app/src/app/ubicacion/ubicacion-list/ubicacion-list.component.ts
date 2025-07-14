import { Component, OnInit } from '@angular/core';
import { Ubicacion } from '../../models/ubicacion.model';
import { Usuario } from '../../models/usuario.model';
import { ApiService } from '../../core/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ubicacion-list',
  standalone: false,
  templateUrl: './ubicacion-list.component.html',
  styleUrl: './ubicacion-list.component.css'
})
export class UbicacionListComponent implements OnInit {
  ubicaciones: Ubicacion[] = [];
  loading = false;
  usuarioActual: Usuario | null = null;
  rolUsuario = '';
  menuItems: any[] = [];

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.api.get<Usuario>('auth/usuario/').subscribe({
      next: (user) => {
        this.usuarioActual = user;
        this.rolUsuario = user.rol?.toUpperCase();

        const rolesPermitidos = ['ADMIN', 'GESTOR'];
        if (!rolesPermitidos.includes(this.rolUsuario)) {
          alert('no tienes permiso para acceder a ubicaciones');
          this.router.navigate(['/dashboard']);
          return;
        }

        this.filtrarMenuPorRol();
        this.cargarUbicaciones();
      },
      error: () => {
        alert('no se pudo cargar el usuario actual');
        this.router.navigate(['/dashboard']);
      }
    });
  }

  filtrarMenuPorRol() {
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
      { label: 'Mantenimientos', icon: 'pi pi-cog', routerLink: '/mantenimientos', roles: ['ADMIN', 'GESTOR'] },
    ];

    this.menuItems = menu.filter(item => item.roles.includes(this.rolUsuario));
  }

  cargarUbicaciones() {
    this.loading = true;
    this.api.getUbicaciones().subscribe({
      next: (data) => {
        this.ubicaciones = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        alert('error al cargar las ubicaciones');
      }
    });
  }

  verDetalle(id: number) {
    this.router.navigate(['/ubicaciones', id]);
  }

  nuevaUbicacion() {
    this.router.navigate(['/ubicaciones', 'nuevo']);
  }
}
