import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { Movimiento } from '../../models/movimiento.model';
import { Router } from '@angular/router';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-movimiento-list',
  standalone: false,
  templateUrl: './movimiento-list.component.html',
  styleUrls: ['./movimiento-list.component.css']
})
export class MovimientoListComponent implements OnInit {
  movimientos: Movimiento[] = [];
  loading = false;
  error = '';
  usuarioActual: Usuario | null = null;
  rolUsuario = '';
  menuItems: any[] = [];

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.loading = true;
    this.api.get<Usuario>('auth/usuario/').subscribe({
      next: (user) => {
        this.usuarioActual = user;
        this.rolUsuario = user.rol;
        this.filtrarMenuPorRol();
        this.getMovimientos();
      },
      error: () => {
        this.error = 'No se pudo cargar el usuario actual';
        this.loading = false;
      }
    });
  }

  filtrarMenuPorRol() {
    const menuCompleto = [
      { label: 'Dashboard', icon: 'pi pi-chart-bar', routerLink: '/dashboard', roles: ['ADMIN','AUDITOR','GESTOR'] },
      { label: 'Bienes', icon: 'pi pi-box', routerLink: '/bienes', roles: ['ADMIN','GESTOR'] },
      { label: 'Categorías', icon: 'pi pi-list', routerLink: '/categorias', roles: ['ADMIN','GESTOR'] },
      { label: 'Responsables', icon: 'pi pi-users', routerLink: '/responsables', roles: ['ADMIN','GESTOR'] },
      { label: 'Movimientos', icon: 'pi pi-exchange', routerLink: '/movimientos', roles: ['ADMIN', 'AUDITOR','GESTOR'] },
      { label: 'Reportes', icon: 'pi pi-chart-line', routerLink: '/reportes', roles: ['ADMIN', 'AUDITOR','GESTOR'] },
      { label: 'Historial de Auditoría', icon: 'pi pi-history', routerLink: '/historial-auditoria', roles: ['ADMIN', 'AUDITOR','GESTOR'] },
      { label: 'Documentos', icon: 'pi pi-file', routerLink: '/documentos', roles: ['ADMIN','GESTOR'] },
      { label: 'Notificaciones', icon: 'pi pi-bell', routerLink: '/notificaciones', roles: ['ADMIN', 'AUDITOR','GESTOR'] },
      { label: 'Etiquetas Digitales', icon: 'pi pi-qrcode', routerLink: '/etiquetas-digitales', roles: ['ADMIN','GESTOR'] },
      { label: 'Ubicaciones', icon: 'pi pi-map-marker', routerLink: '/ubicaciones', roles: ['ADMIN','GESTOR'] },
      { label: 'Mantenimientos', icon: 'pi pi-cog', routerLink: '/mantenimientos', roles: ['ADMIN','GESTOR'] },
    ];

    this.menuItems = menuCompleto.filter(item => item.roles.includes(this.rolUsuario));
  }

  getMovimientos() {
    this.api.getMovimientos().subscribe({
      next: (data) => {
        this.movimientos = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar movimientos';
        this.loading = false;
      }
    });
  }

  verDetalle(id: number) {
    this.router.navigate(['/movimientos', id]);
  }

  eliminarMovimiento(id: number) {
    if (this.rolUsuario !== 'ADMIN') return; // protección adicional
    if (confirm('¿Eliminar este movimiento?')) {
      this.api.deleteMovimiento(id).subscribe({
        next: () => this.getMovimientos(),
        error: () => {
          this.error = 'No se pudo eliminar el movimiento';
        }
      });
    }
  }

  crearMovimiento() {
    if (this.rolUsuario === 'ADMIN') {
      this.router.navigate(['/movimientos', 'nuevo']);
    }
  }

  puedeCrearYEliminar(): boolean {
    return this.rolUsuario === 'ADMIN';
  }
}
