import { Component, OnInit } from '@angular/core';
import { Mantenimiento } from '../../models/mantenimiento.model';
import { ApiService } from '../../core/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-mantenimiento-detail',
  standalone: false,
  templateUrl: './mantenimiento-detail.component.html',
  styleUrl: './mantenimiento-detail.component.css'
})
export class MantenimientoDetailComponent implements OnInit {
  mantenimiento?: Mantenimiento;
  loading = false;
  error: string | null = null;
  usuarioActual: Usuario | null = null;
  rolUsuario = '';
  menuItems: any[] = [];

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit() {
    this.api.get<Usuario>('auth/usuario/').subscribe({
      next: (user) => {
        this.usuarioActual = user;
        this.rolUsuario = user.rol?.toUpperCase();
        const rolesPermitidos = ['ADMIN', 'GESTOR'];

        if (!rolesPermitidos.includes(this.rolUsuario)) {
          alert('no tienes permiso para acceder a esta sección');
          this.router.navigate(['/dashboard']);
          return;
        }

        this.filtrarMenuPorRol();
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (id) {
          this.getMantenimiento(id);
        }
      },
      error: () => {
        this.error = 'no se pudo obtener el usuario actual';
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
      { label: 'Mantenimientos', icon: 'pi pi-cog', routerLink: '/mantenimientos', roles: ['ADMIN', 'GESTOR'] }
    ];

    this.menuItems = menu.filter(item => item.roles.includes(this.rolUsuario));
  }

  getMantenimiento(id: number) {
    this.loading = true;
    this.api.getMantenimiento(id).subscribe({
      next: (data) => {
        this.mantenimiento = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'no se pudo cargar el mantenimiento';
        this.loading = false;
      }
    });
  }

  volver() {
    this.router.navigate(['/mantenimientos']);
  }
}
