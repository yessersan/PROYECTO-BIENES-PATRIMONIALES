import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-mantenimiento-iniciar',
  standalone: false,
  templateUrl: './mantenimiento-iniciar.component.html',
  styleUrl: './mantenimiento-iniciar.component.css'
})
export class MantenimientoIniciarComponent implements OnInit {
  id!: number;
  loading = false;
  error: string | null = null;
  success: string | null = null;
  rolUsuario = '';
  menuItems: any[] = [];

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.api.get<Usuario>('auth/usuario/').subscribe({
      next: (user) => {
        this.rolUsuario = user.rol?.toUpperCase();
        const rolesPermitidos = ['ADMIN', 'GESTOR'];

        if (!rolesPermitidos.includes(this.rolUsuario)) {
          alert('no tienes permiso para acceder a esta sección');
          this.router.navigate(['/dashboard']);
          return;
        }

        this.filtrarMenuPorRol();
        this.id = Number(this.route.snapshot.paramMap.get('id'));
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

  iniciar() {
    this.loading = true;
    this.api.iniciarMantenimiento(this.id, {}).subscribe({
      next: () => {
        this.success = 'mantenimiento iniciado correctamente';
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.error || 'no se pudo iniciar el mantenimiento';
        this.loading = false;
      }
    });
  }

  volver() {
    this.router.navigate(['/mantenimientos']);
  }
}
