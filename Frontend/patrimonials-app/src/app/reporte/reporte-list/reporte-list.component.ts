import { Component, OnInit } from '@angular/core';
import { Reporte } from '../../models/reporte.model';
import { Router } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-reporte-list',
  standalone: false,
  templateUrl: './reporte-list.component.html',
  styleUrl: './reporte-list.component.css'
})
export class ReporteListComponent implements OnInit {
  reportes: Reporte[] = [];
  loading = false;
  error: string | null = null;
  success: string | null = null;
  usuarioActual: Usuario | null = null;
  rolUsuario: string = '';
  menuItems: any[] = [];

  nuevoReporte: Partial<Reporte> = {
    tipo: 'INVENTARIO',
    formato: 'PDF',
    parametros: {}
  };

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.api.get<Usuario>('auth/usuario/').subscribe({
      next: (user) => {
        this.usuarioActual = user;
        this.rolUsuario = user.rol;
        this.filtrarMenuPorRol();
        this.getReportes();
      },
      error: () => {
        this.error = 'No se pudo cargar el usuario actual';
        this.loading = false;
      }
    });
  }

  filtrarMenuPorRol() {
    const todoElMenu = [
      { label: 'Dashboard', icon: 'pi pi-chart-bar', routerLink: '/dashboard', roles: ['ADMIN','AUDITOR','CONSULTA','GESTOR'] },
      { label: 'Bienes', icon: 'pi pi-box', routerLink: '/bienes', roles: ['ADMIN','GESTOR'] },
      { label: 'Categorías', icon: 'pi pi-list', routerLink: '/categorias', roles: ['ADMIN','GESTOR'] },
      { label: 'Responsables', icon: 'pi pi-users', routerLink: '/responsables', roles: ['ADMIN','GESTOR'] },
      { label: 'Movimientos', icon: 'pi pi-exchange', routerLink: '/movimientos', roles: ['ADMIN','AUDITOR','GESTOR'] },
      { label: 'Reportes', icon: 'pi pi-chart-line', routerLink: '/reportes', roles: ['ADMIN', 'CONSULTA','AUDITOR','GESTOR'] },
      { label: 'Historial de Auditoría', icon: 'pi pi-history', routerLink: '/historial-auditoria', roles: ['ADMIN','AUDITOR','GESTOR'] },
      { label: 'Documentos', icon: 'pi pi-file', routerLink: '/documentos', roles: ['ADMIN','GESTOR'] },
      { label: 'Notificaciones', icon: 'pi pi-bell', routerLink: '/notificaciones', roles: ['ADMIN', 'CONSULTA','AUDITOR','GESTOR'] },
      { label: 'Etiquetas Digitales', icon: 'pi pi-qrcode', routerLink: '/etiquetas-digitales', roles: ['ADMIN','GESTOR'] },
      { label: 'Ubicaciones', icon: 'pi pi-map-marker', routerLink: '/ubicaciones', roles: ['ADMIN','GESTOR'] },
      { label: 'Mantenimientos', icon: 'pi pi-cog', routerLink: '/mantenimientos', roles: ['ADMIN','GESTOR'] }
    ];

    this.menuItems = todoElMenu.filter(item => item.roles.includes(this.rolUsuario));
  }

  getReportes() {
    this.loading = true;
    this.api.getReportes().subscribe({
      next: (data) => {
        this.reportes = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar reportes';
        this.loading = false;
      }
    });
  }

  verDetalle(id: number) {
    this.router.navigate(['/reportes', id]);
  }

  crearReporte() {
    this.loading = true;
    this.api.createReporte(this.nuevoReporte).subscribe({
      next: () => {
        this.success = 'Reporte creado correctamente';
        this.getReportes();
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudo crear el reporte';
        this.loading = false;
      }
    });
  }

  eliminarReporte(id: number) {
    if (confirm('¿Seguro que desea eliminar este reporte?')) {
      this.api.deleteReporte(id).subscribe({
        next: () => this.getReportes(),
        error: () => alert('No se pudo eliminar el reporte')
      });
    }
  }
}
